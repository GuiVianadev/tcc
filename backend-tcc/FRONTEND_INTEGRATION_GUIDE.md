# 📚 Guia de Integração Frontend - API de Estudos

Documentação completa para integração do frontend com a API de materiais de estudo.

## 🔐 Autenticação

Todas as rotas (exceto login/registro) requerem autenticação JWT.

```typescript
// Configurar headers para todas as requisições
const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 📋 Índice

1. [Materiais](#materiais)
2. [Resumos](#resumos)
3. [Flashcards](#flashcards)
4. [Quizzes](#quizzes)
5. [Sistema de Progresso de Quizzes](#sistema-de-progresso-de-quizzes)
6. [Estatísticas do Usuário](#estatísticas-do-usuário)

---

## 📦 Materiais

### Criar Material

**Endpoint:** `POST /materials`

**Body (3 opções):**

```typescript
// Opção 1: Criar a partir de um tópico
{
  "title": "React Hooks",
  "topic": "Introdução aos React Hooks"
}

// Opção 2: Criar a partir de arquivo (PDF, DOCX, TXT, PNG, JPG)
{
  "title": "Apostila de Python",
  "file": File // multipart/form-data
}

// Opção 3: Criar vazio (sem conteúdo gerado)
{
  "title": "Meu Material",
  "topic": null,
  "file": null
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "React Hooks",
  "user_id": "uuid",
  "created_at": "2025-01-15T10:00:00Z"
}
```

**Comportamento:**
- Se fornecer `topic` ou `file`, a IA irá gerar automaticamente:
  - 1 resumo
  - 10 flashcards
  - 15 quizzes (entre 10-20)
- Se não fornecer conteúdo, apenas cria o material vazio

---

## 📝 Resumos

### Listar Resumos do Usuário

**Endpoint:** `GET /summaries?page=1`

**Response:**
```json
[
  {
    "id": "uuid",
    "content": "Resumo do conteúdo...",
    "material_id": "uuid",
    "material_title": "React Hooks",
    "created_at": "2025-01-15T10:00:00Z"
  }
]
```

### Buscar Resumo de um Material

**Endpoint:** `GET /materials/:materialId/summary`

**Response:**
```json
{
  "id": "uuid",
  "content": "React Hooks são funções que permitem usar state e outros recursos do React sem escrever uma classe...",
  "material_id": "uuid",
  "created_at": "2025-01-15T10:00:00Z"
}
```

---

## 🎴 Flashcards

### Listar Flashcards do Usuário

**Endpoint:** `GET /flashcards?page=1`

**Response:**
```json
[
  {
    "id": "uuid",
    "question": "O que é useState?",
    "answer": "useState é um Hook que permite adicionar state a componentes funcionais",
    "material_id": "uuid",
    "material_title": "React Hooks",
    "next_review": "2025-01-16T10:00:00Z",
    "easiness_factor": 2.5,
    "interval": 1,
    "repetitions": 0,
    "created_at": "2025-01-15T10:00:00Z"
  }
]
```

### Buscar Flashcards de um Material

**Endpoint:** `GET /materials/:materialId/flashcards`

**Response:** Array de flashcards (mesmo formato acima)

### Revisar Flashcard (Sistema SRS - SM-2)

**Endpoint:** `POST /flashcards/:flashcardId/review`

**Body:**
```json
{
  "quality": 3 // 0-5 (0=blackout, 5=perfect recall)
}
```

**Escala de Qualidade:**
- `0` - Blackout completo (não lembrou)
- `1` - Resposta incorreta, mas reconheceu ao ver
- `2` - Resposta incorreta, mas quase lembrou
- `3` - Resposta correta com dificuldade
- `4` - Resposta correta com hesitação
- `5` - Resposta correta perfeita

**Response:**
```json
{
  "id": "uuid",
  "next_review": "2025-01-17T10:00:00Z",
  "easiness_factor": 2.6,
  "interval": 6,
  "repetitions": 1
}
```

**Comportamento:**
- O algoritmo SM-2 calcula automaticamente:
  - Próxima data de revisão
  - Intervalo entre revisões
  - Fator de facilidade
  - Número de repetições

### Histórico de Revisões

**Endpoint:** `GET /flashcards/:flashcardId/history`

**Response:**
```json
[
  {
    "id": "uuid",
    "flashcard_id": "uuid",
    "quality": 4,
    "reviewed_at": "2025-01-15T10:00:00Z",
    "interval_days": 1,
    "easiness_factor": 2.5
  }
]
```

---

## 🧠 Quizzes

### Listar Quizzes do Usuário

**Endpoint:** `GET /quizzes?page=1`

**Response:**
```json
[
  {
    "id": "uuid",
    "question": "Qual Hook é usado para efeitos colaterais?",
    "options": [
      { "id": "a", "text": "useState" },
      { "id": "b", "text": "useEffect" },
      { "id": "c", "text": "useContext" },
      { "id": "d", "text": "useMemo" }
    ],
    "correct_answer": "b",
    "studied": false,
    "material_id": "uuid",
    "material_title": "React Hooks",
    "created_at": "2025-01-15T10:00:00Z"
  }
]
```

### Buscar Quizzes de um Material

**Endpoint:** `GET /materials/:materialId/quizzes`

**Response:** Array de quizzes (mesmo formato acima)

### Responder Quiz

**Endpoint:** `POST /quizzes/:quizId/answer`

**Body:**
```json
{
  "selectedAnswer": "b"
}
```

**Response:**
```json
{
  "isCorrect": true,
  "correctAnswer": "b"
}
```

**Comportamento:**
- Marca automaticamente o quiz como `studied = true`
- Salva a tentativa em `quiz_attempts`
- Atualiza estatísticas do usuário
- Conta para o progresso do material

---

## 📊 Sistema de Progresso de Quizzes

Sistema completo de progresso com sessões de 10 questões.

### Iniciar Sessão de Quiz

**Endpoint:** `GET /materials/:materialId/quizzes/session`

**Response:**
```json
{
  "quizzes": [
    {
      "id": "uuid",
      "question": "Pergunta aqui?",
      "options": [
        { "id": "a", "text": "Opção A" },
        { "id": "b", "text": "Opção B" },
        { "id": "c", "text": "Opção C" },
        { "id": "d", "text": "Opção D" }
      ],
      "correct_answer": "a",
      "studied": false
    }
    // ... até 10 questões não estudadas
  ],
  "session_size": 10,
  "total_quizzes": 15,
  "studied_count": 5,
  "remaining_count": 10
}
```

**Comportamento:**
- Retorna até 10 questões NÃO estudadas
- Se houver menos de 10 questões restantes, retorna todas
- Se todas já foram estudadas, retorna array vazio

### Ver Progresso

**Endpoint:** `GET /materials/:materialId/quizzes/progress`

**Response:**
```json
{
  "material_id": "uuid",
  "total_quizzes": 15,
  "studied_count": 10,
  "remaining_count": 5,
  "progress_percentage": 67,
  "is_completed": false
}
```

**Cálculo:**
```typescript
progress_percentage = (studied_count / total_quizzes) * 100

// Exemplos:
// 0/15 = 0%
// 5/15 = 33%
// 10/15 = 67%
// 15/15 = 100% ✅
```

### Resetar Progresso

**Endpoint:** `POST /materials/:materialId/quizzes/reset`

**Response:**
```json
{
  "message": "Progress reset successfully"
}
```

**Comportamento:**
- Marca todos os quizzes do material como `studied = false`
- Permite refazer todos os quizzes
- NÃO deleta histórico de tentativas anteriores

---

## 📈 Estatísticas do Usuário

### Obter Estatísticas Completas

**Endpoint:** `GET /users/me/statistics`

**Response:**
```json
{
  "total_materials": 5,
  "total_flashcards": 50,
  "total_quizzes": 75,
  "flashcards_reviewed_today": 10,
  "quizzes_completed_today": 15,
  "total_study_days": 30,
  "current_streak": 7,
  "flashcard_stats": {
    "total_reviews": 120,
    "average_quality": 4.2,
    "mastered_count": 25,
    "learning_count": 15,
    "new_count": 10
  },
  "quiz_stats": {
    "total_attempts": 200,
    "correct_attempts": 160,
    "accuracy_percentage": 80,
    "average_time_per_quiz": 45
  },
  "recent_activity": [
    {
      "date": "2025-01-15",
      "flashcards_reviewed": 10,
      "quizzes_completed": 5,
      "study_time_minutes": 45
    }
  ]
}
```

---

## 🎯 Fluxo de Uso Completo

### 1. Criar Material e Estudar

```typescript
// 1. Criar material com tópico
const { data: material } = await api.post('/materials', {
  title: 'React Hooks',
  topic: 'Hooks básicos do React'
});
// IA gera automaticamente: resumo + 10 flashcards + 15 quizzes

// 2. Ver resumo
const { data: summary } = await api.get(`/materials/${material.id}/summary`);
console.log(summary.content);

// 3. Iniciar sessão de quiz (10 questões)
const { data: session } = await api.get(`/materials/${material.id}/quizzes/session`);

// 4. Responder cada questão
for (const quiz of session.quizzes) {
  const userAnswer = await getUserAnswerFromUI(quiz);

  const { data: result } = await api.post(`/quizzes/${quiz.id}/answer`, {
    selectedAnswer: userAnswer
  });

  if (result.isCorrect) {
    showSuccess('Correto!');
  } else {
    showError(`Errado! A resposta correta é: ${result.correctAnswer}`);
  }
}

// 5. Ver progresso
const { data: progress } = await api.get(`/materials/${material.id}/quizzes/progress`);
console.log(`Progresso: ${progress.progress_percentage}%`);

if (progress.is_completed) {
  showCelebration('Parabéns! Você completou 100% dos quizzes!');
}

// 6. Revisar flashcards
const { data: flashcards } = await api.get(`/materials/${material.id}/flashcards`);

for (const flashcard of flashcards) {
  const quality = await showFlashcardAndGetQuality(flashcard);

  await api.post(`/flashcards/${flashcard.id}/review`, {
    quality: quality // 0-5
  });
}
```

### 2. Componentes de UI Sugeridos

#### Progress Bar
```tsx
<ProgressBar
  value={progress.progress_percentage}
  max={100}
  label={`${progress.studied_count}/${progress.total_quizzes} questões`}
/>

{progress.is_completed && (
  <Badge variant="success">
    🎉 100% Completo!
  </Badge>
)}
```

#### Session Counter
```tsx
<SessionInfo>
  <p>Sessão atual: {Math.ceil(progress.studied_count / 10)}</p>
  <p>Questões restantes: {progress.remaining_count}</p>
</SessionInfo>
```

#### Flashcard Review Interface
```tsx
<FlashcardReview>
  <h3>{flashcard.question}</h3>
  <button onClick={() => setShowAnswer(true)}>Ver Resposta</button>

  {showAnswer && (
    <>
      <p>{flashcard.answer}</p>
      <QualityButtons>
        <button onClick={() => review(0)}>Não lembrei (0)</button>
        <button onClick={() => review(3)}>Com dificuldade (3)</button>
        <button onClick={() => review(5)}>Perfeito! (5)</button>
      </QualityButtons>
    </>
  )}
</FlashcardReview>
```

#### Quiz Interface
```tsx
<Quiz>
  <h3>{quiz.question}</h3>
  {quiz.options.map(option => (
    <button
      key={option.id}
      onClick={() => answerQuiz(quiz.id, option.id)}
      disabled={answered}
      className={answered ? (
        option.id === quiz.correct_answer ? 'correct' :
        option.id === selectedAnswer ? 'incorrect' : ''
      ) : ''}
    >
      {option.id.toUpperCase()}) {option.text}
    </button>
  ))}
</Quiz>
```

---

## 🔄 Sistema de Repetição Espaçada (SRS)

O sistema usa o algoritmo **SM-2** (SuperMemo 2) para flashcards:

### Como Funciona

1. **Primeira revisão:** Intervalo de 1 dia
2. **Segunda revisão:** Intervalo de 6 dias
3. **Revisões seguintes:** Intervalo multiplicado pelo fator de facilidade

### Fatores

- **Easiness Factor (EF):** 1.3 - 2.5+
  - Aumenta com respostas boas (quality >= 3)
  - Diminui com respostas ruins (quality < 3)

- **Interval:** Dias até próxima revisão
  - Calculado automaticamente
  - Resetado se quality < 3

- **Repetitions:** Número de revisões consecutivas corretas

### Recomendações

- Mostrar apenas flashcards onde `next_review <= hoje`
- Ordenar por `next_review` (mais atrasados primeiro)
- Incentivar revisões diárias
- Gamificar com streaks e badges

---

## ⚠️ Tratamento de Erros

```typescript
try {
  const { data } = await api.post('/materials', {...});
} catch (error) {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        // Dados inválidos
        showError('Verifique os dados enviados');
        break;
      case 401:
        // Não autenticado
        redirectToLogin();
        break;
      case 403:
        // Sem permissão
        showError('Você não tem permissão para acessar este recurso');
        break;
      case 404:
        // Não encontrado
        showError('Material não encontrado');
        break;
      case 500:
        // Erro no servidor
        showError('Erro ao processar. Tente novamente.');
        break;
    }
  }
}
```

---

## 📌 Notas Importantes

1. **Geração de Conteúdo:**
   - A IA gera **10 flashcards** e **15 quizzes** por padrão
   - Pode variar entre 10-20 quizzes dependendo do conteúdo
   - Aceita tópicos curtos (ex: "React Hooks")

2. **Formatos Suportados:**
   - PDF (`.pdf`)
   - Word (`.docx`)
   - Texto (`.txt`)
   - Imagens (`.png`, `.jpg`)

3. **Sessões de Quiz:**
   - Sempre 10 questões por sessão
   - Apenas questões não estudadas
   - Progresso salvo automaticamente

4. **Sistema SRS:**
   - Baseado no algoritmo SM-2
   - Calcula automaticamente intervalos
   - Não precisa implementar a lógica no frontend

5. **Paginação:**
   - Todas as listagens usam `?page=1`
   - Page size padrão: definido no backend

---

## 🎨 Exemplos de Estados de UI

### Loading States
```tsx
// Gerando material
<Spinner text="Gerando conteúdo com IA..." />

// Carregando quiz
<Skeleton type="quiz" />

// Processando resposta
<Button loading>Verificando...</Button>
```

### Empty States
```tsx
// Nenhum material
<EmptyState
  icon="📚"
  title="Nenhum material ainda"
  action="Criar Primeiro Material"
/>

// Todas questões estudadas
<CompletedState
  icon="🎉"
  title="Parabéns!"
  message="Você completou todos os quizzes!"
  action="Refazer Quizzes"
/>
```

### Success States
```tsx
// Quiz correto
<Alert variant="success">
  ✅ Correto! Continue assim!
</Alert>

// Sessão completa
<Celebration>
  🎊 Sessão completa! +10 quizzes estudados
</Celebration>
```

---

## 🚀 Próximos Passos Recomendados

1. Implementar notificações de revisão (flashcards vencidos)
2. Adicionar gráficos de progresso (Chart.js, Recharts)
3. Gamificação (badges, níveis, XP)
4. Modo offline (PWA com cache)
5. Compartilhamento de materiais entre usuários
6. Exportação de estatísticas (PDF, CSV)

---

