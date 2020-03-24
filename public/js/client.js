//define comment modules as a class

class Comments {
    constructor() {
        this.baseurl = 'api/v1/comments';
        this.comments = [];
        this.$comments = document.getElementById('comment-board');
        this.$form = document.getElementById('comment-form');
        //this.$inputName = document.getElementById('input-name');
        //this.$inputLocation = document.getElementById('input-location');
        //this.$inputEmail = document.getElementById('input-email');
        //this.$inputComment = document.getElementById('inoput-comment');
    }

    //initialize
    async init() {
        await this.updateComments();
        this.$form.addEventListener('submit', async evt => {
            evt.preventDefault();
            await this.createComment();
        });
    }

    //GET comments
    async getComments() {
        //get api data
        let data = await fetch(this.baseurl);
        //turn it into json format
        data = await data.json();
        //fill the comments array with the data
        this.comments = data;
        //render that data!
        await this.renderComments();
    }

    //POST comments
    async createComment() {
        try {
            const newData = {
                //set the name input to "name"
                name: this.$form.name.value,
                //set location value
                location: this.$form.location.value,
                //set email
                email: this.$form.email.value,
                //set comment
                comment: this.$form.comment.value
            };
            const options = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newData)
            };
            //get the data from the api
            let data = await fetch(this.baseurl, options);
            //format it as a json
            data = await data.json();

            //update the comment board with the new comment
            await this.updateComments();
            //reset form values
            this.$form.name.value = "";
            this.$form.location.value = "";
            this.$form.email.value = "";
            this.$form.comment.value = "";
        } catch (error) {
            console.error(error);
        }
    }

    //update comments
    async updateComments() {
        await this.getComments();
        this.renderComments();
    }

    //render comments in the DOM
    renderComments() {
        //reset the HTML
        this.$comments.innerHTML = '';
        //update the html for each comment
        this.comments.forEach(item => {
            this.$comments.innerHTML +=
                `<div class="comment" id="comment-block" id="${item._id}">
                     <div class="comment__row">
                         <h3 class="heading-tertiary comment__header">name</h3>
                        <p class="comment__content">${item.name}</p>
                    </div>
                    <div class="comment__row">
                         <h3 class="heading-tertiary comment__header">location</h3>
                        <p class="comment__content">${item.location}</p>
                    </div>
                    <div class="comment__row">
                        <h3 class="heading-tertiary comment__header">comment</h3>
                        <p class="comment__content">${item.comment}</p>
                    </div>
                </div>`;

        });
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const comments = new Comments();
    await comments.init();
});