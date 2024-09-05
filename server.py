from flask import Flask, jsonify, request, send_from_directory, render_template
import json
import os
from datetime import datetime

app = Flask(__name__, static_folder='data/static', template_folder='web/pages')

@app.route('/')
def serve_survey():
    return render_template('survey.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

@app.route('/api/survey_data')
def get_survey_data():
    config_path = os.path.join(os.path.dirname(__file__), 'data', 'survey_config.json')
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Generate video sources dynamically
    config['videoSources'] = generate_video_sources(config['totalPages'], config['models'])
    
    return jsonify(config)

def generate_video_sources(total_pages, models):
    video_sources = []
    for page in range(1, total_pages + 1):
        page_videos = []
        for model in models:
            page_videos.extend([
                f"/static/videos/{page}_{model}.mp4",
                f"/static/videos/{page}_{model}_2.mp4"
            ])
        video_sources.append({
            "page": page,
            "videos": page_videos
        })
    return video_sources

@app.route('/api/submit_response', methods=['POST'])
def submit_response():
    try:
        response = request.json
        responses_dir = os.path.join(os.path.dirname(__file__), 'data', 'responses')
        os.makedirs(responses_dir, exist_ok=True)
        
        # Generate a unique filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f'response_page{response["page"]}_{timestamp}.json'
        
        with open(os.path.join(responses_dir, filename), 'w') as f:
            json.dump(response, f, indent=2)
        
        print(f"Response saved: {filename}")  # Log to console
        return jsonify({"status": "success", "message": f"Response saved as {filename}"})
    except Exception as e:
        print(f"Error saving response: {str(e)}")  # Log to console
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
