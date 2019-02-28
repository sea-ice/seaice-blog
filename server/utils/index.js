import PostModel from '../mongodb/schemas/Post'
import TagModel from '../mongodb/schemas/Tag'
import CommentModel from '../mongodb/schemas/Comment'

export async function formatPostList (posts) {
  if (!posts.length) return []
  posts = posts.map(post => post._doc)
  if (
    posts[0].tags &&
    (typeof posts[0].tags[0] === 'number')
  ) {
    let tags = await Promise.all(posts.map(
      item => Promise.all(
        item.tags.map(
          tag => TagModel.findOne({
            _id: tag
    }).select('name'))))) // [[{_id: xx, name: '...'}], [...]]
    posts = posts.map((post, i) => Object.assign({}, post, {
      tags: tags[i]
    }))
  }
  if (!posts[0].commentCount) {
    let comments = await Promise.all(
      posts.map(
        post => CommentModel.count({
          belongToPost: post._id,
          replyTo: -1
    })))
    posts = posts.map((post, i) => Object.assign({}, post, {
      commentCount: comments[i]
    }))
  }

  if (posts[0].publishTime instanceof Date) {
    posts = posts.map(post => {
      let d = post.publishTime
      return Object.assign({}, post, {
        publishTime: {
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          date: d.getDate(),
          hour: d.getHours(),
          minute: d.getMinutes()
        }
      })
    })
  }
  return posts
}
