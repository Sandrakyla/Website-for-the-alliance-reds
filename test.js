document.addEventListener('DOMContentLoaded', function() {
    const quizContainer = document.getElementById('quiz-container');
    const submitButton = document.getElementById('submit-btn');
    const resultsContainer = document.getElementById('results');

    // Вопросы и ответы
    const quizData = [
        {
            question: "Какой класс эффективен против пехоты?",
            answers: {
                a: "Стрелки",
                b: "Всадники",
                c: "Инженеры"
            },
            correctAnswer: "a"
        },
        {
            question: "Какой класс эффективен против стрелков?",
            answers: {
                a: "Пехота",
                b: "Рейдеры",
                c: "Инженеры"
            },
            correctAnswer: "b"
        },
        {
            question: "Какой класс эффективен против всадников?",
            answers: {
                a: "Пехота",
                b: "Стрелки",
                c: "Инженеры"
            },
            correctAnswer: "a"
        },
        {
            question: "Сколько нужно стрел для того, чтобы попасть в рейтинг 'Великого охотника'?",
            answers: {
                a: "100",
                b: "300",
                c: "500"
            },
            correctAnswer: "c"
        },
        {
            question: "Какое здание требует 'знаки победы'?",
            answers: {
                a: "Дозорная вышка",
                b: "Боевой центр",
                c: "Нефтезавод"
            },
            correctAnswer: "b"
        },
        {
            question: "Какой минимум очков нужно набрать на событии Помпеии, для получения наград?",
            answers: {
                a: "15.000",
                b: "10.000",
                c: "Неважно"
            },
            correctAnswer: "a"
        },
        {
            question: "Сколько нужно фрагментов, чтобы собрать один чип для зверей?",
            answers: {
                a: "30",
                b: "80",
                c: "60"
            },
            correctAnswer: "с"
        },
        {
            question: "Какое максимальное количество очков в событии 'Главный командир' можно заработать в 1 и 6 день, за счёт ускорений?",
            answers: {
                a: "100 миллионов",
                b: "50 миллионов",
                c: "Неограниченное количество"
            },
            correctAnswer: "a"
        },
        {
            question: "Какое максимальное количество очков в событии 'Главный командир' можно заработать, за счёт улучшения цеха?",
            answers: {
                a: "Неограниченное количество",
                b: "40 миллионов",
                c: "100 миллионов"
            },
            correctAnswer: "c"
        },
        {
            question: "Как правильно пользоваться региональными баффами?",
            answers: {
                a: "Попросить бафф в региональном чате, отправить свои координаты. Запустить исследование, стройку или тренировку. После получения баффа сидеть и ждать пока не завершится исследование, стройка или тренировка",
                b: "Попросить бафф в региональном чате, отправить свои координаты. После получения, запустить исследование, стройку или тренировку. Написать в региональный чат, о выполнении",
                c: "Попросить бафф в региональном чате. После получения, запустить исследование, стройку или тренировку."
            },
            correctAnswer: "b"
        },
    ];

    // Генерация теста
    function buildQuiz() {
        quizData.forEach((currentQuestion, questionNumber) => {
            const answers = [];
            
            for (const letter in currentQuestion.answers) {
                answers.push(
                    `<label class="answer-option">
                        <input type="radio" name="question${questionNumber}" value="${letter}">
                        ${letter.toUpperCase()}) ${currentQuestion.answers[letter]}
                    </label>`
                );
            }
            
            quizContainer.innerHTML += `
                <div class="question-block" id="question-${questionNumber}">
                    <div class="question-text">${currentQuestion.question}</div>
                    <div class="answers">${answers.join('')}</div>
                </div>
            `;
        });
    }

    // Проверка ответов
    function showResults() {
        const answerContainers = quizContainer.querySelectorAll('.question-block');
        let numCorrect = 0;
        
        quizData.forEach((currentQuestion, questionNumber) => {
            const answerContainer = answerContainers[questionNumber];
            const selector = `input[name=question${questionNumber}]:checked`;
            const userAnswer = (answerContainer.querySelector(selector) || {});
            
            if (userAnswer.value === currentQuestion.correctAnswer) {
                numCorrect++;
                answerContainer.classList.add('correct');
                answerContainer.classList.remove('incorrect');
            } else {
                answerContainer.classList.add('incorrect');
                answerContainer.classList.remove('correct');
            }
        });
        
        resultsContainer.innerHTML = `
            <h3>Результат: ${numCorrect} из ${quizData.length}</h3>
            ${numCorrect === quizData.length ? 
                '<p>🎉 Идеально! Ты настоящий эксперт!</p>' : 
                numCorrect >= quizData.length/2 ? 
                '<p>👍 Хороший результат! Еще немного практики.</p>' : 
                '<p>💪 Продолжай учиться! Ты сможешь!</p>'}
        `;
        submitToServer();
    }

    function collectAnswers() {
        return quizData.map((q, i) => {
            const selected = document.querySelector(`input[name=question${i}]:checked`);
            return `
                ❓ Вопрос: ${q.question}
                ✅ Правильный ответ: ${q.answers[q.correctAnswer]}
                💡 Выбрано: ${selected ? q.answers[selected.value] : "Нет ответа"}
                ${selected?.value === q.correctAnswer ? "✔ Верно" : "✖ Ошибка"}
            `.replace(/\n\s+/g, '\n').trim();
        }).join('\n\n--------------------\n\n');
    }

    function submitToServer() {
        const form = document.getElementById('gform');
        const answersText = collectAnswers();
        
        // Заполняем скрытые поля
        document.getElementById('form-answers').value = answersText;
        document.getElementById('username').value = 
            document.getElementById('username').value || "Аноним";
    
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = 'Ответы успешно отправлены!';
        document.body.appendChild(notification);
    
        // Отправка через Formspree
        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                notification.classList.add('success', 'show');
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => notification.remove(), 300);
                }, 3000);
            } else {
                throw new Error('Ошибка отправки');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Меняем уведомление на ошибку
            notification.textContent = 'Ошибка отправки! Ответы сохранены локально.';
            notification.classList.add('error', 'show');
            
            // Резервное сохранение в localStorage
            const data = {
                username: document.getElementById('username').value,
                answers: answersText,
                timestamp: new Date().toISOString()
            };
            const submissions = JSON.parse(localStorage.getItem('quizSubmissions') || '[]');
            submissions.push(data);
            localStorage.setItem('quizSubmissions', JSON.stringify(submissions));
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        });
    }

    document.getElementById('username').value = 
    prompt("Введите ваш игровой ник:") || "Аноним";


    // Собираем тест
    buildQuiz();
    
    // Обработчик кнопки
    submitButton.addEventListener('click', showResults);
});