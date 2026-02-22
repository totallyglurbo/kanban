Vue.component('column', {
    props: {
        cards: {
            type: Array,
            required: true
        },
    },
    template: `
    <div>
         <p v-if="!cards.length">There are no cards yet.</p>
    </div>
    `,
    methods: {
    addCard(cardItem) {
            let newCard = {
                name: cardItem.name,
            };
            this.cards.push(newCard)
            this.$emit('update-cards', this.cards);
        },
    }
})
Vue.component('card', {
    template: `
    <form @submit.prevent="onSubmit">
        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
         <p>
           <label for="name">Title:</label>
           <input id="name" v-model="name" placeholder="Title">
         </p>
        <p>
           <label for="name">Description:</label>
           <input id="name" v-model="name" placeholder="Description">
         </p>
         <p>
           <input type="submit" value="Submit" class="submit">
         </p>
    </form>
    `,
    data() {
        return {
            createdAt: Date.now(),
            name: null,
            description: null,
            deadline: null,
        }
    }
})
let app = new Vue ({
    el: '#app',
    data: {
        planTasks: [],
        workTasks: [],
        testTasks: [],
        compTasks: []
    },
})