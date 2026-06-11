const inputElement = document.getElementById('todo-input');
const addButtonElement = document.getElementById('add-btn');
const allDeleteElement = document.getElementById('all-delete');
const todoListElement = document.getElementById('todo-list');

// 1. 우리의 진짜 데이터 그릇 (할 일 목록 배열)
let todos = [];

// 2. 창고(로컬 스토리지)에 데이터를 저장하는 함수
function saveTodos() {
    // 배열(todos)을 문자열로 바꿔서 'myTodos'라는 이름표를 붙여 저장합니다.
    localStorage.setItem('myTodos', JSON.stringify(todos));
}

// 3. 화면을 그리는 함수 (배열에 있는 데이터를 바탕으로 카드를 만듭니다)
function renderTodos() {
    todoListElement.innerHTML = ''; 

    todos.forEach(function(todo) {
        const newCard = document.createElement('div');
        
        const textSpan = document.createElement('span');
        textSpan.textContent = todo.text; 
        
        textSpan.classList.add('todo-text');
        
        const completeBtn = document.createElement('button');

        // 완료 상태에 따른 완전 새로운 디자인 로직
        if (todo.isCompleted === true) {
            // 카드 전체에 연두색 테마 클래스 적용 (CSS에서 정의한 것)
            newCard.classList.add('card-completed');

            // 글자에 취소선과 연한 색 적용 (이전보다 더 연하게)
            textSpan.style.textDecoration = 'line-through';
            textSpan.style.color = '#bbb'; 

            // [핵심] 글자 왼쪽에 꽂을 '연두색 체크 아이콘' span 만들기
            const checkIcon = document.createElement('span');
            checkIcon.textContent = '✓'; // 체크 모양 문자
            checkIcon.classList.add('check-icon'); // CSS에서 정의한 아이콘 스타일 적용

            // [조립 변경] 카드 안에 체크 아이콘을 먼저 넣고, 그 뒤에 글자를 넣음
            newCard.appendChild(checkIcon); 
            
            completeBtn.textContent = '취소'; 
        } else {
            completeBtn.textContent = '완료'; 
        }

        completeBtn.addEventListener('click', function() {
            todo.isCompleted = !todo.isCompleted; 
            saveTodos(); 
            renderTodos();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', function() {
            if (confirm('정말 삭제하시겠습니까?\n삭제 후 복구할 수 없습니다.')) {
                todos = todos.filter(function(t) {
                    return t.id !== todo.id; 
                });
                saveTodos();    
                renderTodos();  
            }
        });

        // 이미 위에서 조립된 체크 아이콘 + 글자 뒤에, 버튼들을 조립
        newCard.appendChild(textSpan); // (todo.isCompleted가 true라면 checkIcon 뒤에 붙음)
        newCard.appendChild(completeBtn);
        newCard.appendChild(deleteBtn);
        todoListElement.appendChild(newCard);
    });

    // [ 달성률 계산 로직 ]
    // 1. 필요한 HTML 태크 가져오기
    const progressText = document.getElementById('progress-text');
    const progressBarFill = document.getElementById('progress-bar-fill');

    // 2. 전체 개수, 완료된 일 개수 세기
    // 전체 개수
    const totalCount = todos.length;
    // 완료된 일 개수 / 배열 중에서 isCompleted가 true인 것
    const completedCount = todos.filter(function(t) {
        return t.isCompleted === true;
    }).length;

    // 3. % 퍼센트 계산
    let percentage = 0;
    if(totalCount > 0) {
        percentage = Math.round((completedCount / totalCount)*100);
    }

    // 4. 화면에 띄우기
    progressText.textContent = `버킷리스트: ${percentage}% 완료`;
    progressBarFill.style.width = percentage + '%';
}

// 4. '추가하기' 버튼을 눌렀을 때
addButtonElement.addEventListener('click', function() {
    const inputValue = inputElement.value;
    if (inputValue === '') {
        alert('버킷리스트를 입력해주세요!');
        return;
    }

    // 새로운 할 일 '객체' 데이터 만들기
    const newTodo = {
        id: Date.now(), // 카드를 구별하기 위한 고유 번호 (현재 시간을 밀리초로 사용)
        text: inputValue,
        isCompleted: false
    };

    todos.push(newTodo); // 1. 배열에 데이터 밀어 넣기
    saveTodos();         // 2. 창고에 저장하기
    renderTodos();       // 3. 화면 다시 그리기

    inputElement.value = '';
});

allDeleteElement.addEventListener('click', function() {
    if(confirm("정말 전체 삭제하시겠습니까?\n삭제 후 복구할 수 없습니다.")) {
        todos = [];
        saveTodos();
        renderTodos();
    }
})

// 5. 프로그램이 맨 처음 시작될 때 실행되는 부분 (초기화)
function loadTodos() {
    const savedData = localStorage.getItem('myTodos'); // 창고에서 데이터 꺼내기
    
    if (savedData !== null) { // 창고에 저장된 데이터가 있다면?
        todos = JSON.parse(savedData); // 문자열을 다시 배열로 풀어서 todos 그릇에 담기
        renderTodos(); // 불러온 데이터를 바탕으로 화면 그리기
    }
}

// 브라우저를 켜자마자 가장 먼저 저장된 데이터를 불러옵니다.
loadTodos();