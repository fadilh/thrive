from flask import Flask, request, jsonify
import ollama

app = Flask(__name__)

ollama_model = 'llama3.1'

@app.route('/validate-message', methods=['POST'])
def summarize():
    data = request.json.get("data")
    if not data:
        return jsonify({'error': 'data parameter is required'}), 400
    
    message = data.get("message")
    
    final_prompt = f"""
    {message}
    The above text is a message that is gonna be sent in a forum. 
    Check if this message is hurtful or insults anyone. If it is, return why it was blocked, else just say its fine to send.
    What I want you to return is a one sentence response of the message evaluation, if the message is hurtful.
    Do not include the actual message in your response, just the reasoning.
    """
 
    try:
        response = ollama.chat(model=ollama_model, messages=[{'role': 'user', 'content': final_prompt}])
        return jsonify({'output': response['message']['content']})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=5001)
    app.run(debug=True)