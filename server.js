const express = require('express')
const app = express();
const logger = require('./util/logger')

const PORT = process.env.PORT || 9000;
let words = [];


// init middleware
app.use(express.text()) // body parser
app.use(logger);  

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));


// Add word
app.post('/words', (req, res) => {
    const addWord = req.body;
    if (!addWord) {
        return res.status(400).send('Please write a word');
    }

    const isFound = words.some(word => word.text === addWord);
    if (isFound) {
        words.forEach(word => {
            if (word.text === addWord) {
                word.count++;
                res.send(String(word.count));
            }
        });
    } else {
        words.push(
            {
                text: addWord,
                count: 1
            }
        )
        res.send('0') 
    }
})


// Get all words
app.get('/words', (req, res) => {
    res.json(words)
})

// Get one word
app.get('/words/:word', (req, res) => {
    const askWord = req.params.word;
    const found = words.some(word => word.text === askWord)

    if (found) {
        res.json(words.filter(word => word.text === askWord));
    } else {
        res.status(400).send(`'${askWord}' not found`) 
    }
})


// Delete word
app.delete('/words/:word', (req, res) => {
    const delWord = req.params.word;
    const found = words.some(word => word.text === delWord)

    if (found) {
        words = words.filter(word => word.text !== delWord)
        res.json({
            msg: 'Word deleted',
            words
        });
    } else {
        res.status(400).send(`'${delWord}' not found`) 
    }

})
