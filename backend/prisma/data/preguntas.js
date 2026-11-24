export const CATEGORIAS = [
    "JavaScript basico",
    "Arrays y objetos",
    "DOM y navegador",
    "Asincronia",
];

export const PREGUNTAS_INICIALES = [
    {
        id: "js-01",
        categoria: "JavaScript basico",
        enunciado: "¿Qué palabra reservada declara una variable que no se puede reasignar?",
        opciones: ["var", "let", "const", "function"],
        correcta: 2,
        puntaje: 10
    },
    {
        id: "js-02",
        categoria: "JavaScript basico",
        enunciado: "¿Qué devuelve typeof 42?",
        opciones: ["\"string\"", "\"number\"", "\"boolean\"", "\"object\""],
        correcta: 1,
        puntaje: 10
    },
    {
        id: "js-03",
        categoria: "JavaScript basico",
        enunciado: "¿Qué función convierte el texto \"25\" en el número entero 25?",
        opciones: ["parseInt", "console.log", "typeof", "alert"],
        correcta: 0,
        puntaje: 10
    },
    {
        id: "js-04",
        categoria: "JavaScript basico",
        enunciado: "¿Qué devuelve confirm cuando el usuario presiona \"Cancelar\"?",
        opciones: ["null", "undefined", "Un texto vacío", "false"],
        correcta: 3,
        puntaje: 20
    },
    {
        id: "js-05",
        categoria: "JavaScript basico",
        enunciado: "¿Qué bucle ejecuta su código al menos una vez antes de evaluar la condición?",
        opciones: ["for", "while", "do while", "forEach"],
        correcta: 2,
        puntaje: 20
    },
    {
        id: "arr-01",
        categoria: "Arrays y objetos",
        enunciado: "¿Qué método agrega un elemento al final de un array?",
        opciones: ["push", "pop", "shift", "slice"],
        correcta: 0,
        puntaje: 10
    },
    {
        id: "arr-02",
        categoria: "Arrays y objetos",
        enunciado: "¿Qué método crea un nuevo array solo con los elementos que cumplen una condición?",
        opciones: ["map", "filter", "find", "sort"],
        correcta: 1,
        puntaje: 10
    },
    {
        id: "arr-03",
        categoria: "Arrays y objetos",
        enunciado: "¿Cuál es el índice del primer elemento de un array?",
        opciones: ["1", "-1", "0", "Depende del array"],
        correcta: 2,
        puntaje: 10
    },
    {
        id: "arr-04",
        categoria: "Arrays y objetos",
        enunciado: "¿Qué método se usa para acumular valores, por ejemplo para sumar todos los elementos?",
        opciones: ["includes", "findIndex", "forEach", "reduce"],
        correcta: 3,
        puntaje: 20
    },
    {
        id: "arr-05",
        categoria: "Arrays y objetos",
        enunciado: "¿Qué palabra reservada se usa para crear una instancia de una clase?",
        opciones: ["class", "new", "this", "constructor"],
        correcta: 1,
        puntaje: 20
    },
    {
        id: "dom-01",
        categoria: "DOM y navegador",
        enunciado: "¿Qué método obtiene un elemento del documento por su id?",
        opciones: ["getElementById", "querySelectorAll", "getElementsByClassName", "createElement"],
        correcta: 0,
        puntaje: 10
    },
    {
        id: "dom-02",
        categoria: "DOM y navegador",
        enunciado: "¿Qué método del evento submit impide que el formulario se envíe?",
        opciones: ["stopForm", "preventDefault", "removeEventListener", "clear"],
        correcta: 1,
        puntaje: 10
    },
    {
        id: "dom-03",
        categoria: "DOM y navegador",
        enunciado: "¿Qué tipo de dato guarda Local Storage?",
        opciones: ["Objetos", "Números", "Solo strings", "Arrays"],
        correcta: 2,
        puntaje: 10
    },
    {
        id: "dom-04",
        categoria: "DOM y navegador",
        enunciado: "¿Qué método inserta un elemento creado con JavaScript dentro de otro?",
        opciones: ["appendChild", "setAttribute", "classList", "innerText"],
        correcta: 0,
        puntaje: 20
    },
    {
        id: "dom-05",
        categoria: "DOM y navegador",
        enunciado: "¿Qué función se usa para convertir un objeto en texto antes de guardarlo en Local Storage?",
        opciones: ["JSON.parse", "parseInt", "localStorage.getItem", "JSON.stringify"],
        correcta: 3,
        puntaje: 20
    },
    {
        id: "asinc-01",
        categoria: "Asincronia",
        enunciado: "¿Qué función ejecuta otra función una sola vez después de cierto tiempo?",
        opciones: ["setInterval", "setTimeout", "clearTimeout", "clearInterval"],
        correcta: 1,
        puntaje: 10
    },
    {
        id: "asinc-02",
        categoria: "Asincronia",
        enunciado: "¿En qué unidad se indica el tiempo de setTimeout y setInterval?",
        opciones: ["Segundos", "Minutos", "Milisegundos", "Microsegundos"],
        correcta: 2,
        puntaje: 10
    },
    {
        id: "asinc-03",
        categoria: "Asincronia",
        enunciado: "¿Qué función detiene un intervalo creado con setInterval?",
        opciones: ["clearInterval", "clearTimeout", "stopInterval", "removeItem"],
        correcta: 0,
        puntaje: 10
    },
    {
        id: "asinc-04",
        categoria: "Asincronia",
        enunciado: "¿Cuál de estos NO es un estado de una promesa?",
        opciones: ["Pending", "Fulfilled", "Rejected", "Finished"],
        correcta: 3,
        puntaje: 20
    },
    {
        id: "asinc-05",
        categoria: "Asincronia",
        enunciado: "¿Qué método se ejecuta cuando una promesa se cumple correctamente?",
        opciones: ["catch", "then", "finally", "reject"],
        correcta: 1,
        puntaje: 10
    },
    {
        id: "asinc-06",
        categoria: "Asincronia",
        enunciado: "¿Qué método se ejecuta cuando una promesa termina, sin importar el resultado?",
        opciones: ["then", "catch", "finally", "resolve"],
        correcta: 2,
        puntaje: 10
    },
    {
        id: "asinc-07",
        categoria: "Asincronia",
        enunciado: "¿Dónde se puede usar la palabra await?",
        opciones: ["En cualquier parte del código", "Dentro de una función async", "Solo dentro de un for", "Solo dentro de un if"],
        correcta: 1,
        puntaje: 20
    },
    {
        id: "asinc-08",
        categoria: "Asincronia",
        enunciado: "Con async/await, ¿qué bloque se usa para capturar los errores?",
        opciones: ["if/else", "do/while", "try/catch", "switch"],
        correcta: 2,
        puntaje: 20
    },
    {
        id: "asinc-09",
        categoria: "Asincronia",
        enunciado: "¿Qué recibe como parámetros la función que se pasa al constructor de una Promise?",
        opciones: ["resolve y reject", "then y catch", "async y await", "try y catch"],
        correcta: 0,
        puntaje: 20
    },
    {
        id: "asinc-10",
        categoria: "Asincronia",
        enunciado: "¿Qué método de Response se usa para obtener los datos de una petición hecha con fetch?",
        opciones: ["text", "ok", "status", "json"],
        correcta: 3,
        puntaje: 20
    }
];
