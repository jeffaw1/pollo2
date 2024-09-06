# pollo2

# 3D Human Pose Estimation Survey

## Project Overview

This project is a web-based survey application designed to compare the performance of four different 3D human pose estimation models: TRAM, ScoreHMR, NIKI, and SMPLER-X. The survey presents users with video pairs for each model and asks them to evaluate the models based on various criteria.

## Features

- 25-page survey with 8 videos per page (2 videos for each of the 4 models)
- 4 questions per page to evaluate different aspects of the models
- Dynamic video loading based on the current page
- Play/stop all videos simultaneously
- Response submission for each page
- Responsive design for various screen sizes

## Project Structure

```
project_root/
│
├── data/
│   ├── static/
│   │   ├── background.jpg
│   │   ├── upc_logo.png
│   │   ├── main.css
│   │   └── survey.js
│   │
│   ├── videos/
│   │   ├── 1_TRAM.mp4
│   │   ├── 1_TRAM_2.mp4
│   │   ├── 1_ScoreHMR.mp4
│   │   ├── 1_ScoreHMR_2.mp4
│   │   ├── 1_NIKI.mp4
│   │   ├── 1_NIKI_2.mp4
│   │   ├── 1_SMPLER-X.mp4
│   │   ├── 1_SMPLER-X_2.mp4
│   │   ... (repeat for all 25 pages)
│   │
│   ├── responses/
│   │   └── (JSON response files will be stored here)
│   │
│   └── survey_config.json
│
├── web/
│   └── pages/
│       └── survey.html
│
├── server.py
├── requirements.txt
└── README.md
```

## Setup and Installation

1. Ensure you have Python 3.7+ installed on your system.

2. Clone this repository:
   ```
   git clone <repository-url>
   cd <project-directory>
   ```

3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Prepare your video files:
   - Place your video files in the `data/static/videos/` directory.
   - Follow the naming convention: `{page_number}_{model_name}.mp4` and `{page_number}_{model_name}_2.mp4`.
   - Ensure you have videos for all 25 pages and all 4 models.

5. Customize the survey:
   - Edit `data/survey_config.json` to modify the questions or adjust the number of pages if needed.
   - Update `data/static/background.jpg` and `data/static/upc_logo.png` with your preferred images.

6. Run the server:
   ```
   python server.py
   ```

7. Access the survey in your web browser at `http://localhost:5000`.

## Usage

- Users can navigate through the survey using the "Previous" and "Next" buttons.
- For each page, users can play/pause individual videos or use the "Play All" and "Stop All" buttons.
- Users answer the four questions for each page by selecting one model for each question.
- Responses are automatically submitted when moving to the next page.
- Response data is stored as JSON files in the `data/responses/` directory.

## Customization

- To modify the survey questions, edit the `questions` array in `data/survey_config.json`.
- To change the number of pages, update the `totalPages` value in `data/survey_config.json`.
- To add or remove models, update the `models` array in `data/survey_config.json` and ensure corresponding video files are present.

## Data Collection

- User responses are saved as JSON files in the `data/responses/` directory.
- Each response file is named `response_page{page_number}_{timestamp}.json`.
- The JSON files contain the page number and the user's answers to each question.

## Development

- The main application logic is in `server.py`.
- Frontend JavaScript is in `data/static/survey.js`.
- Styling is handled in `data/static/main.css`.
- The HTML template is located at `web/pages/survey.html`.

## Deployment

For local development and testing, the built-in Flask server is sufficient. For production deployment, consider using a production-grade WSGI server like Gunicorn and a reverse proxy like Nginx.

## Future Improvements

- Implement user authentication for controlled access to the survey.
- Add a results page to show aggregated survey data.
- Implement a progress saving feature to allow users to resume incomplete surveys.

## Support

For any issues or questions, please open an issue in the project repository or contact the project maintainer.
