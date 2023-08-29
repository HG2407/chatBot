<template>
    <div class="box">
        <div class="displayBox" ref="displayBox">
            <p class='message' v-for="number in divNumber" :key="number">
                {{messageHistory[number-1]}}
            </p>
        </div>
        <p v-if="pleaseWait" class="wait"> Please wait...</p>
        <input type="text" class="search_bar" v-model="userInput" @keydown.enter="send">
        <button @click="send">Enter</button>
    </div>
</template>

<script>
import axios from 'axios';
    export default {
        name: 'ChatBot',
        data() {
            return {
                userInput: null,
                firstMessage: true,
                messageHistory: [],
                divNumber: 0,
                pleaseWait: false,
                enterClicked: false
            }
        },

        methods: {
            async send() {
                let response;
                if(!this.enterClicked) {
                    this.enterClicked = true;
                    this.divNumber++;
                    this.messageHistory.push(this.userInput);
                    this.userInput = '';
                    this.$nextTick(() =>{
                        this.$refs['displayBox'].scrollTop = this.$refs['displayBox'].scrollHeight;
                    })
                    this.pleaseWait = true;
                    if(this.firstMessage) {
                        response = await axios.post('/api/prompt', {
                        input: this.messageHistory[this.messageHistory.length-1],
                        firstMessage: true
                        });
                        this.firstMessage = false;
                    } else {
                        response = await axios.post('/api/prompt', {
                        input: this.messageHistory[this.messageHistory.length-1],
                        });
                    }
                    this.pleaseWait = false;
                    this.divNumber++;
                    this.messageHistory.push(response.data);
                    this.enterClicked = false;
                    this.$nextTick(() =>{
                        this.$refs['displayBox'].scrollTop = this.$refs['displayBox'].scrollHeight;
                    })
                }
            }
        }
    }
</script>


<style scoped>
    
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }
    
    .box {
        position: relative;
        font-family: 'Poppins';
        width: 25rem;
        height: 35rem;
        display: inline-block;
        text-align: center;
    }

    .wait {
        margin: 0px;
        width: fit-content;
        height: fit-content;
        position: absolute;
        bottom: 8%;
        right: 40%;
    }

    .displayBox {
        width: 100%;
        background-color: gainsboro;
        height: 32rem;
        padding-top: 0.5rem;
        overflow-y: scroll;
    }

    ::-webkit-scrollbar{
        width: 0;
    }
    .search_bar {
        height: 3rem;
        width: 25rem;
        overflow-wrap: break-word;
    }

    .message {
        width: 100%;
        overflow-wrap: break-word;
        padding: 0.5rem;
        text-align: left;
        padding-left: 1.5rem;
    }

    button {
        position: absolute;
        height: 2.3rem;
        right: 0%;
        border: none;
        background: transparent;
        cursor: pointer;
        bottom: 1%;
        font-family: 'Poppins', sans-serif;
        opacity: 0.4;
    }
</style>