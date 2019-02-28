import PostModel from '../../mongodb/schemas/Post'
import TagModel from '../../mongodb/schemas/Tag'
import CommentModel from '../../mongodb/schemas/Comment'
import UserModel from '../../mongodb/schemas/User'
const resolvers = {
  Query: {
    posts () {
      return PostModel.find().exec()
    },
    post (root, params) {
      let _id = params.id
      return PostModel.findOneAndUpdate({
        _id
      }, {
        $inc: {
          visitCount: 1
        }
      }, {
        new: true
      }).exec()
    },
    totalItemsInHome () {
      return PostModel.count({
        isDraft: false,
        isIndependentPage: false
      }).exec()
    },
    pageDataInHome (root, params) {
      let {itemsPerPage, page} = params,
          skip = itemsPerPage * (page - 1)
      return PostModel.find({
        isDraft: false,
        isIndependentPage: false
      }).sort('-publishTime').skip(skip).limit(itemsPerPage).exec()
    },
    hotArticles () {
      return PostModel.find({
        isDraft: false,
        isIndependentPage: false,
        visitCount: {
          $gt: 10
        }
      }).sort('-visitCount').limit(8).exec()
    },
    IPagePosts () {
      return PostModel.find({
        isDraft: false,
        isIndependentPage: true
      }).exec()
    },
    allTags () {
      // 只选取非独立页面的标签进行返回
      return PostModel.find({
        isDraft: false,
        isIndependentPage: false
      }).select({tags: 1}).then(posts => {
        return new Set(posts.map(post => post.tags).reduce((prev, cur) => prev.concat(...cur)))
      }).then(tagIds => {
        return TagModel.find({
          _id: {
            $in: Array.from(tagIds)
          }
        }).sort('+createTime').exec()
      })
    },
    totalItemsInTags (root, params) {
      let {tagId} = params
      return PostModel.count({
        isDraft: false,
        isIndependentPage: false,
        tags: {
          $in: [tagId]
        }
      }).exec()
    },
    pageDataInTags (root, params) {
      let {tagId, skip, limit} = params
      return PostModel.find({
        isDraft: false,
        isIndependentPage: false,
        tags: {
          $in: [tagId]
        }
      }).sort('-publishTime').skip(skip).limit(limit).exec()
    }
  },
  Post: {
    tags (post) {
      return post.tags.map(
        _id => TagModel.findOne({
          _id
        }).exec()
      )
    },
    comments (post) {
      return CommentModel.find({
        belongToPost: post._id
      }).exec()
    },
    commentCount (post) {
      return CommentModel.count({
        belongToPost: post._id,
        replyTo: -1
      }).exec()
    }
  },
  Comment: {
    publisher (comment) {
      return UserModel.findOne({
        _id: comment.publisher
      }).exec()
    },
    belongToPost (comment) {
      return PostModel.findOne({
        _id: comment.belongToPost
      }).exec()
    }
  },
  Date: {
    year (date) {
      return date.getFullYear()
    },
    month (date) {
      return date.getMonth()
    },
    date (date) {
      return date.getDate()
    },
    hour (date) {
      return date.getHours()
    },
    minute (date) {
      return date.getMinutes()
    }
  }
}

export default resolvers
