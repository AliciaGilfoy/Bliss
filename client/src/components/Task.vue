<template>
  <ul
    class="list-group list-group-flush"
    draggable="true"
    @dragstart="dragStart"
    @dragend="dragEnd"
  >
    <li class="list-group-item listItem h5">
      {{taskData.title}}
      <div>
        <button
          type="button"
          class="btn btn-info rounded-circle"
          data-toggle="modal"
          :data-target="'#commentModal'+taskData.id"
        >
          <i class="fas fa-comment"></i>
        </button>
        <button
          @click="deleteTask(taskData)"
          type="button"
          class="btn btn-outline-danger rounded-circle"
        >
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div
        class="modal fade bd-example-modal-sm"
        :id="'commentModal'+taskData.id"
        tabindex="-1"
        role="dialog"
        aria-labelledby="mySmallModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
          <div class="modal-content gradient">
            <h5 class="text-green pl-1 mt-2">
              <u>Comments</u>
            </h5>
            <ul class="list-group list-group-flush m-2">
              <li
                class="list-group-item listItem row"
                v-for="(commentObj) in comments"
                :key="commentObj._id"
              >
                <p
                  @click="deleteComment(commentObj)"
                  class="deletebutton col-12 text-right text-danger"
                >X</p>
                <h5 class="col-12">{{commentObj.body}}</h5>
                <p class="col-12 text-right">-{{commentObj.author}}</p>
              </li>
              <div v-if="newCommentForm">
                <div class="bg-info p-2 m-3">
                  <form @submit.prevent="addCommentToList">
                    <input
                      class="my-2"
                      type="text"
                      name="newCommentBody"
                      id="newCommentBody"
                      v-model="newComment.body"
                      placeholder="Enter new comment..."
                    />
                    <input
                      class="my-2"
                      type="text"
                      name="newCommentAuthor"
                      id="newCommentAuthor"
                      v-model="newComment.author"
                      placeholder="Enter your name..."
                    />
                    <button
                      type="submit"
                      class="fas fa-comment-medical text-success float-right m-3 addbutton"
                    ></button>
                  </form>
                </div>
              </div>
            </ul>
            <i
              v-if="!newCommentForm"
              @click.prevent="newCommentForm=true"
              class="fas fa-comment-medical text-warning float-right m-3"
            ></i>
            <i
              v-if="newCommentForm"
              @click.prevent="newCommentForm=false"
              class="fas fa-comment-slash text-danger float-right m-3"
            ></i>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "Task",
  props: ["taskData"],
  computed: {
    comments() {
      return this.taskData.comments;
    }
  },
  data() {
    return {
      newCommentForm: false,
      newComment: {}
    };
  },
  methods: {
    addCommentToList() {
      let body = {
        comments: [
          {
            body: this.newComment.body,
            author: this.newComment.author
          }
        ]
      };
      let task = this.taskData.id;
      let list = this.taskData.listId;
      this.$store.dispatch("addComment", {
        task: task,
        list: list,
        body: body
      });
    },
    deleteComment(comment) {
      Swal.fire({
        title: "Are you sure you want to delete this comment?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        backdrop: `
      rgba(123, 0, 16, 0.4)
  `
      }).then(result => {
        if (result.value) {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          let body = {
            body: comment.body,
            author: comment.author,
            _id: comment._id
          };
          let task = this.taskData.id;
          let list = this.taskData.listId;
          this.$store.dispatch("deleteComment", {
            task: task,
            list: list,
            body: body
          });
        }
      });
    },
    deleteTask(task) {
      Swal.fire({
        title: "Are you sure you want to delete this task?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        backdrop: `
      rgba(123, 0, 16, 0.4)
  `
      }).then(result => {
        if (result.value) {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          this.$store.dispatch("deleteTask", task);
        }
      });
    },
    dragStart() {
      this.$store.commit("setActiveTask", {
        taskId: this.taskData.id,
        oldList: this.taskData.listId
      });
      console.log("dragStart task id" + this.taskData.id);
    },
    dragEnd() {
      console.log("dragEnd");
    }
  }
};
</script>

<style scoped>
.listItem {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  background-color: transparent;
  align-items: baseline;
}
.showme {
  overflow: visible !important;
  height: fit-content;
  position: absolute;
  z-index: 900;
  width: 15rem;
}

.list-group {
  overflow: visible;
  background-color: transparent;
}
i {
  cursor: pointer;
}
.gradient {
  background-image: linear-gradient(
    to top right,
    rgb(120, 248, 248),
    rgb(90, 252, 139)
  );
}
.addbutton {
  background-color: transparent;
  border: transparent;
}
.deletebutton {
  cursor: pointer;
}
</style>