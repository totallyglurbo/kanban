Vue.component('column', {
    props: {
        cards: {
            type: Array,
            required: true
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    template: `
    <div>
        <h2>New tasks</h2>
        <div>
            <p v-if="!cards.length" class="noCards">There are no cards yet.</p>
            <ul>
              <li v-for="(card, cIndex) in sortedCards" :key="cIndex" class="cardName">
                <p><strong>{{ card.name }}</strong></p>
                <p>{{ card.description }}</p>
                <p>Priority: {{ card.priority }}</p>
                <b>Deadline: {{ card.deadline }}</b>
              </li>
            </ul>
           </div>
           <card v-if="show" @card-submitted="addCard"></card>
       </div>

    </div>
    `,
    methods: {
    addCard(cardItem) {
            let newCard = {
                name: cardItem.name,
                description: cardItem.description,
                deadline: cardItem.deadline,
                priority: cardItem.priority
            };
            this.cards.push(newCard)
            this.$emit('update-cards', this.cards);
        },
    },
    computed: {
        sortedCards() {
            return this.cards.slice().sort((a, b) => a.priority - b.priority);
        }
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
           <input id="name" v-model="description" placeholder="Description">
        </p>
        <p>
          <label for="priority">Priority (1-5):</label>
          <select v-model.number="priority" id="priority">
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
        </p>
        <p>
            <label for="deadline">Deadline:</label>
            <input type="date" v-model="deadline">
        <p>
           <input type="submit" value="Submit" class="submit">
         </p>
    </form>
    `,
    data() {
        return {
            name: null,
            description: null,
            deadline: null,
            priority: 1,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            this.errors = [];
            if (!this.name) {
                this.errors.push("Name required.");
            }
            if (!this.deadline) {
                this.errors.push("Deadline required.");
            }
            if (!this.description) {
                this.errors.push("Description required.");
            }
            if (this.errors.length === 0) {
                let cardItem = {
                    name: this.name,
                    description: this.description,
                    deadline: this.deadline,
                    priority: this.priority
                };
                this.$emit('card-submitted', cardItem);
                this.name = null;
                this.description = null;
                this.deadline = null;
                this.priority = 1;
            }
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