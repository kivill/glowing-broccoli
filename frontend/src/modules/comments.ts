import { reactive, toRefs } from 'vue'
import { api } from 'boot/axios'
import { Notify } from 'quasar'
interface Creator {
    _id: string;
    fullName: string;
}
interface Comment {
    _id?: string;
    creator?: string | Creator;
    point: string;
    comment: string;
    status?: string;
}

interface CommentState {
    isCommentsLoading: boolean;
    isCurrentLoading: boolean;
    comments?: Comment[];
    currentComment?: Comment;
    canEditComment: boolean
}

const state = reactive<CommentState>({
    isCommentsLoading: true,
    isCurrentLoading: false,
    comments: undefined,
    currentComment: {
        comment: '',
        point: '',
    },
    canEditComment: true,
})

export const useComments = () => {
    const getAllComments = (): void => {
        api.get<Array<Comment>>('/comments/')
            .then(data => {
                state.comments = data.data.filter(e => e.status == 'created')
            })
            .catch((error) => {
                console.error(error)
            })
    }
    const getComments = (id: string): void => {
        state.isCommentsLoading = true;
        api.get<Array<Comment>>(`/comments/${id}`)
            .then((data) => {
                state.comments = data.data.filter(e => e.status == 'approved')
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                state.isCommentsLoading = false;
            })
    }
    const updateStatus = (id: string, status: string, text: string): void => {
        void api.put(`/comments/${id}`, { status }).then(_ => {
            if (_.status == 201) {
                getAllComments();
                Notify.create({
                    type: status == 'declined' ? 'negative' : 'positive',
                    message: 'Комментарий ' + text + (status == 'declined' ? ' отклонен' : 'одобрен'),
                    position: 'bottom-right'
                })
            }
        })
    }
    const sendComment = () => {
        void api.post<Comment>('/comments', state.currentComment).then(_ => {
            if (_.status == 201 && state.currentComment) {
                void getComments(state.currentComment?.point);
                state.currentComment.comment = '';
            }
            else throw ''
        })
            .catch(() => {
                Notify.create({
                    type: 'negative',
                    message: 'Не удалось оставить комментарий',
                    position: 'bottom-right'
                })
            })
    }
    return {
        getComments,
        sendComment,
        getAllComments,
        updateStatus,
        ...toRefs(state),
    }
}
