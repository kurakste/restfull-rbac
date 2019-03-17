import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    console.log('connect');
    res.send('hello world!');
});

app.listen(port, ()=> {
    console.log(`Server started on port ${port}`);
})