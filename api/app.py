from flask import Flask, request, jsonify
import ollama
import tensorflow as tf
import pandas as pd


app = Flask(__name__)

ollama_model = 'llama3.1'

model = tf.keras.models.load_model("model.keras")

toxic_classifier = pipeline("text-classification", model="unitary/toxic-bert")

vocab_size = 20000
tokenizer = tf.keras.preprocessing.text.Tokenizer(num_words=vocab_size, oov_token="<OOV>")
df = pd.read_csv('train.csv')
texts = df['comment_text'].values
tokenizer.fit_on_texts(texts) 
categories = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json.get("data")
    if not data:
        return jsonify({'error': 'data parameter is required'}), 400
    
    message = data.get("message")

    resources = """
        SMU Teletherapy by AcademicLiveCare
        High-quality, on-demand mental health care designed specifically for students. All SMU students can now initiate on-demand counseling and video appointments with a medical professional with AcademicLiveCare (ALC) on your smartphone, tablet, or computer FOR FREE!

        Campus Well
        Check out SMU's health and well-being blog! This site has tons of information written by students for students. Read articles, watch videos, take quizzes and more! SMU Campus Well is here to help you build a balanced and happy life.

        TogetherAll
        Mental health support. 24/7. Confidential, online peer community.

        Collegiate Recovery Community at SMU
        Struggling with substance abuse or addiction and need a change? There are students right here on campus going through the same thing who are here to support you.


        Mustangs Don't Haze
        At SMU, hazing is not tolerated! Keep your friends, teammates, brothers, sisters, and fellow org members safe by taking a stand against hazing today. #MustangsDontHaze
    """

    final_prompt = f"""
    {resources}
    Using the resources given above, recommend one of the resources above based on this message given to you by a person, who probably is seeking mental help.
    Keep your response short and concise. 
    For this message:
    {message}
    """

    try:
        response = ollama.chat(model=ollama_model, messages=[{'role': 'user', 'content': final_prompt}])
        return jsonify({'output': response['message']['content']})
    except Exception as e:
        return jsonify({'error': str(e)})
    

@app.route('/validate-message', methods=['POST'])
def validate():
    data = request.json.get("data")
    if not data:
        return jsonify({'error': 'data parameter is required'}), 400
    
    message = data.get("message")
    
    prediction = predict_comment(message)

    total = 0
    for category, prob in prediction.items():
        total += prob
        print(f"{category}: {prob:.4f}")

    return jsonify({'output': f'{total < 0.10}'})

    
def predict_comment(comment):
    sequence = tokenizer.texts_to_sequences([comment])
    padded_sequence = tf.keras.preprocessing.sequence.pad_sequences(sequence, maxlen=150, padding='post', truncating='post') 

    predictions = model.predict(padded_sequence)[0]

    result = {categories[i]: predictions[i] for i in range(len(categories))}
    
    return result

if __name__ == '__main__':
    app.run(debug=False)