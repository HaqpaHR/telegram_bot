const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '5287511588:AAFWN5pa5dUhzP1sEI4UILmxQdAYOiU-q7I'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадал число от 0 до 9, угадай...')
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить инфу'},
        {command: '/game', description: 'Do you want to play a little game?'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/3a8/089/3a808939-11b0-3246-bc65-6b73dc9560ab/3.webp')
            return  bot.sendMessage(chatId, `Добро пожаловать в бот команду`)
        }
        if (text === '/info') {
            return  bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }

        if (text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'Ты - дурак, или не являешься собой?')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю угадал ${data}`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `LOOOSER, it is ${chats[chatId]}`, againOptions)
        }

    })
}

start()