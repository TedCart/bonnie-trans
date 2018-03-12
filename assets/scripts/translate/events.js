'use strict'

const getFormFields = require(`../../../lib/get-form-fields`)

const alphabet = require('./alphabet.js')

let startIsString = true
let endIsString = true

const inputList = [
  'textEncodeText',
  'textDecodeText',
  'textEncodeNumbers',
  'numbersDecodeText',
  'textEncodeSymbols',
  'symbolsDecodeText'
]

function translateLetter (startLetters, endLetters, oldLetter) {
  const charIndex = startLetters.indexOf(oldLetter)
  // If the letter is in the cypher
  if (charIndex !== -1) {
    // Return the corresponding letter/symbol from the endLetters
    return endIsString ? endLetters.charAt(charIndex) : endLetters[charIndex] + '-'
  } else {
    // Adds extra space between number-encoded-words
    if ((oldLetter === ' ') && (!endIsString)) { return ' ' }
    if (!endIsString) { return oldLetter + '-' }
    return oldLetter
  }
}

function encodeBase (startLetters, endLetters, inputText) {
  startIsString = ((typeof startLetters) === 'string')
  endIsString = ((typeof endLetters) === 'string')
  let numberArray
  // this converts the string into an array if we're doing numbers to text.
  if (!startIsString) {
    let oldText = 1
    let newText = 2
    numberArray = inputText
    while (oldText !== newText) {
      oldText = numberArray
      numberArray = numberArray.replace(/ {2}/g, ' ')
      numberArray = numberArray.replace(/ {1}/g, '- -')
      newText = numberArray
    }
    numberArray = inputText.split('-')
  }
  let newMessage = ''
  for (let i = 0; i < inputText.length; i++) {
    const oldLetter = startIsString ? inputText.charAt(i).toUpperCase() : numberArray[i]
    const newLetter = translateLetter(startLetters, endLetters, oldLetter)
    if ((!endIsString) && (newLetter === ' ')) {
      // removes extra hyphen character at end of word
      newMessage = newMessage.substring(0, newMessage.length - 1)
    }
    newMessage = newMessage + newLetter
    if ((!endIsString)) {
      if (i === inputText.length - 1) {
        // removes extra hyphen character at end of word
        newMessage = newMessage.substring(0, newMessage.length - 1)
      }
    }
    if (!startIsString) {
      if (i === numberArray.length - 1) {
        break
      }
    }
  }
  return newMessage
}

function clearInputs () {
  for (let i = 0; i < inputList.length; i++) {
    $('#' + inputList[i]).val('')
  }
}

function renderMessage (decodedMessage, encodedMessage) {
  const newDecodedMessage = document.createElement('p')
  newDecodedMessage.innerText = decodedMessage.toUpperCase()
  const newEncodedMessage = document.createElement('p')
  newEncodedMessage.innerText = encodedMessage.toUpperCase()
  document.getElementById('decodedMessageDiv').prepend(newDecodedMessage)
  document.getElementById('encodedMessageDiv').prepend(newEncodedMessage)
  clearInputs()
}

function textEncodeText (event) {
  const data = getFormFields(this)
  event.preventDefault()
  console.log('data is: \n', data)
  const inputText = data.message.text
  const newMessage = encodeBase(alphabet.base, alphabet.letterCypher, inputText)
  renderMessage(inputText, newMessage)
}

function textEncodeNumbers (event) {
  const data = getFormFields(this)
  event.preventDefault()
  const inputText = data.message.text
  const newMessage = encodeBase(alphabet.base, alphabet.numberCypher, inputText)
  renderMessage(inputText, newMessage)
}

function textEncodeSymbols (event) {
  const data = getFormFields(this)
  event.preventDefault()
  const inputText = data.message.text
  const newMessage = encodeBase(alphabet.base, alphabet.symbolCypher, inputText)
  renderMessage(inputText, newMessage)
}

function textDecodeText (event) {
  const data = getFormFields(this)
  event.preventDefault()
  const inputText = data.message.text
  const newMessage = encodeBase(alphabet.letterCypher, alphabet.base, inputText)
  renderMessage(newMessage, inputText)
}

function numbersDecodeText (event) {
  const data = getFormFields(this)
  event.preventDefault()
  const inputText = data.message.text
  const newMessage = encodeBase(alphabet.numberCypher, alphabet.base, inputText)
  renderMessage(newMessage, inputText)
}

function symbolsDecodeText (event) {
  const data = getFormFields(this)
  event.preventDefault()
  const inputText = data.message.text
  const newMessage = encodeBase(alphabet.symbolCypher, alphabet.base, inputText)
  renderMessage(newMessage, inputText)
}

function addHandlers () {
  $('#textEncodeTextForm').on('submit', textEncodeText)
  $('#textDecodeTextForm').on('submit', textDecodeText)
  $('#textEncodeNumbersForm').on('submit', textEncodeNumbers)
  $('#numbersDecodeTextForm').on('submit', numbersDecodeText)
  $('#textEncodeSymbolsForm').on('submit', textEncodeSymbols)
  $('#symbolsDecodeTextForm').on('submit', symbolsDecodeText)
}

module.exports = {
  addHandlers
}
