Vue.component('column', {
    props: {
        cards: {
            type: Array,
            required: true
        },
        show: {
            type: Boolean,
            default: false
        },
        work: {
            type: Boolean,
            default: false
        },
        comp: {
            type: Boolean,
            default: false
        },
        edit: {
            type: Boolean,
            default: true
        }
    },
    template: `
    <div>
        <div>
            <p v-if="!cards.length" class="noCards">There are no cards yet.</p>
            <ul>
              <li v-for="(card, cIndex) in sortedCards" :key="cIndex" class="cardName">
                <div v-if="editingIndex === cIndex">
                    <input v-model="tempName" placeholder="Title">
                    <input v-model="tempDescription" placeholder="Description">
                    <select v-model.number="tempPriority">
                      <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                    </select>
                    <input type="date" v-model="tempDeadline">
                    <button @click="saveEdit(cIndex)">Save</button>
                    <button @click="cancelEdit">Cancel</button>
                </div>
                <div v-else>
                    <p><strong>{{ card.name }}</strong></p>
                    <p>{{ card.description }}</p>
                    <p>Priority: {{ card.priority }}</p>
                    <b>Deadline: {{ card.deadline }}</b>
                    <p v-if="card.returnReason">Reason: {{ card.returnReason }}</p>
                    <p v-if="card.deadlineStatus">{{ card.deadlineStatus }}</p>
                    <p>Created at: {{ card.createdAt }}</p>
                    <p>Last edited:</p>
                      <div>
                        <p v-for="(time, tIndex) in card.editTimes" :key="tIndex">{{ time }}</p>
                      </div>
                    <button @click="$emit('move-to-work', cIndex)" v-if="show">To work</button>
                    <button @click="showReturnReason(cIndex)" v-if="comp">Back to work</button>
                    <div v-if="showReturnDialog">
                      <p>Enter the reason:</p>
                      <input v-model="reason" placeholder="Причина" />
                      <button @click="submitReturn" :disabled="!reason.trim()">Submit</button>
                      <button @click="showReturnDialog = false">Cancel</button>
                    </div>
                    <button @click="$emit('move-to-test', cIndex)" v-if="work">To test</button>
                    <button @click="$emit('move-to-comp', cIndex)" v-if="comp">To completed</button>
                    <button @click="startEdit(cIndex)" v-if="edit">Edit</button>
                    <button @click="deleteCard(cIndex)" v-if="show" @delete-card="deleteCardByIndex">Delete</button>
                </div>
              </li>
            </ul>
           </div>
           <card v-if="show" @card-submitted="addCard"></card>
       </div>

    </div>
    `,
    data() {
        return {
          editingIndex: null,
          tempName: '',
          tempDescription: '',
          tempPriority: 1,
          tempDeadline: '',
          showReturnDialog: false,
          returnIndex: null,
          reason: ''
        }
    },
    methods: {
        addCard(cardItem) {
        const now = new Date().toLocaleString();
            let newCard = {
                name: cardItem.name,
                description: cardItem.description,
                deadline: cardItem.deadline,
                priority: cardItem.priority,
                createdAt: new Date().toLocaleString(),
                editTimes: []
            };
            this.cards.push(newCard)
            this.$emit('update-cards', this.cards);
        },
        deleteCard(index) {
            this.cards.splice(index, 1);
            this.$emit('update-cards', this.cards);
        },
        deleteCardByIndex(index) {
            this.cards.splice(index, 1);
            this.$emit('update-cards', this.cards);
        },
        startEdit(cIndex) {
          this.editingIndex = cIndex
          const card = this.cards[cIndex]
          this.tempName = card.name
          this.tempDescription = card.description
          this.tempPriority = card.priority
          this.tempDeadline = card.deadline
        },
        saveEdit(cIndex) {
            const now = new Date().toLocaleString();
            const card = this.cards[cIndex];
            card.editTimes.push(now);
            this.cards.splice(cIndex, 1, {
                ...card,
                name: this.tempName,
                description: this.tempDescription,
                priority: this.tempPriority,
                deadline: this.tempDeadline
            });
            this.$emit('update-cards', this.cards);
            this.editingIndex = null;
        },
        cancelEdit() {
          this.editingIndex = null
        },
        showReturnReason(index) {
            this.showReturnDialog = true;
            this.returnIndex = index;
            this.reason = '';
          },
          submitReturn() {
            this.$emit('return-to-work', this.returnIndex, this.reason);
            this.showReturnDialog = false;
          }
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
        },
        deleteCard() {
            this.$emit('delete-card');
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
    methods: {
          moveCardToWork(index) {
            const card = this.planTasks.splice(index, 1)[0];
            this.workTasks.push(card);
          },
          moveCardToTest(index) {
            const card = this.workTasks.splice(index, 1)[0];
            this.testTasks.push(card);
          },
          moveCardToComp(index) {
            const card = this.testTasks.splice(index, 1)[0];
            const now = new Date();
            const deadline = new Date(card.deadline);

          if (deadline < now) {
            card.deadlineStatus = 'Deadline is overdue';
          } else {
            card.deadlineStatus = 'Deadline is not overdue';
          }
            this.compTasks.push(card);
          },
           returnFromTestToWork(index, reason) {
            const card = this.testTasks.splice(index, 1)[0];
            card.returnReason = reason;
            this.workTasks.push(card);
          }
        }
})