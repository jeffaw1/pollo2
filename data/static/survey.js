let currentPage = 1;
let surveyData;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        surveyData = await fetchSurveyData();
        console.log('Survey data loaded:', surveyData);
        updatePage();
        setupEventListeners();
    } catch (error) {
        console.error('Error loading survey data:', error);
    }
});

async function fetchSurveyData() {
    const response = await fetch('/api/survey_data');
    return await response.json();
}

function updatePage() {
    console.log('Updating page:', currentPage);
    updateVideos();
    updateQuestions();
    updatePageIndicator();
    updateNavigationButtons();
}

function updateVideos() {
    const videoGrid = document.querySelector('.video-grid');
    videoGrid.innerHTML = '';

    const pageVideos = surveyData.videoSources.find(source => source.page === currentPage);
    
    if (!pageVideos) {
        console.error('No videos found for page:', currentPage);
        return;
    }

    console.log('Updating videos for page:', currentPage, pageVideos);

    for (let i = 0; i < surveyData.models.length; i++) {
        const videoPair = document.createElement('div');
        videoPair.className = 'video-pair';

        const modelName = surveyData.models[i];
        const modelTitle = document.createElement('h3');
        modelTitle.textContent = modelName;
        videoPair.appendChild(modelTitle);

        for (let j = 0; j < 2; j++) {
            const video = document.createElement('video');
            video.controls = true;
            video.src = pageVideos.videos[i * 2 + j];
            videoPair.appendChild(video);
        }

        videoGrid.appendChild(videoPair);
    }
}

function updateQuestions() {
    const questionsContainer = document.getElementById('questions');
    questionsContainer.innerHTML = '';

    surveyData.questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question mb-3';
        questionDiv.innerHTML = `
            <p><strong>Q${index + 1}:</strong> ${question}</p>
            <div class="btn-group" role="group">
                ${surveyData.models.map((model, i) => `
                    <input type="radio" class="btn-check" name="q${index}" id="q${index}_${i}" value="${model}">
                    <label class="btn btn-outline-primary" for="q${index}_${i}">${model}</label>
                `).join('')}
            </div>
        `;
        questionsContainer.appendChild(questionDiv);
    });
}

function updatePageIndicator() {
    document.getElementById('pageIndicator').textContent = `Page ${currentPage} of ${surveyData.totalPages}`;
}

function updateNavigationButtons() {
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === surveyData.totalPages;
}

function setupEventListeners() {
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePage();
        }
    });

    document.getElementById('nextBtn').addEventListener('click', async () => {
        if (currentPage < surveyData.totalPages) {
            try {
                await submitResponses();
                currentPage++;
                updatePage();
            } catch (error) {
                console.error('Error submitting responses:', error);
                alert('Failed to submit responses. Please try again.');
            }
        }
    });

    document.getElementById('playAllBtn').addEventListener('click', playAllVideos);
    document.getElementById('stopAllBtn').addEventListener('click', stopAllVideos);
}

function playAllVideos() {
    document.querySelectorAll('video').forEach(video => video.play());
}

function stopAllVideos() {
    document.querySelectorAll('video').forEach(video => {
        video.pause();
        video.currentTime = 0;
    });
}

async function submitResponses() {
    const responses = {};
    surveyData.questions.forEach((_, index) => {
        const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
        responses[`q${index + 1}`] = selectedOption ? selectedOption.value : null;
    });

    const response = {
        page: currentPage,
        responses: responses
    };

    console.log('Submitting responses:', response);

    const result = await fetch('/api/submit_response', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(response),
    });

    const data = await result.json();
    console.log('Submit response result:', data);

    if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to submit responses');
    }
}
