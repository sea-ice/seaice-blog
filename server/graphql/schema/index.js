import {makeExecutableSchema} from 'graphql-tools'
import resolvers from '../resolver'

const typeDefs = `
type Query {
  post(id: Int): Post
  posts: [Post]
  totalItemsInHome: Int
  pageDataInHome(page: Int, itemsPerPage: Int): [Post]
  hotArticles: [Post]
  allTags: [Tag]
  totalItemsInTags(tagId: Int): Int
  pageDataInTags(tagId: Int, skip: Int, limit: Int): [Post]
  IPagePosts: [Post]
}

type Post {
  _id: Int
  title: String
  content: String
  excerpt: String
  publishTime: Date
  lastModifiedAt: Date
  tags: [Tag]
  location: Location
  isIndependentPage: Boolean
  visitCount: Int
  comments: [Comment]
  commentCount: Int
  pageReferUrl: String
}

type Tag {
  _id: Int
  name: String
  createTime: Date
  class: String
}

type Location {
  country: String
  province: String
  city: String
}

type Date {
  year: Int,
  month: Int,
  date: Int,
  hour: Int,
  minute: Int
}

type Comment {
  _id: Int
  publisher: User
  content: String
  replyTo: Int
  location: Location
  belongToPost: Post
  publishTime: Date
}

type User {
  _id: Int
  nickname: String
  avatar: String
  email: String
  token: String
}
`
// 在resolver/index.js中不需要解析Location类型，本身Location类型在mongoose中保存的类型就是对象

export default makeExecutableSchema({
  typeDefs,
  resolvers
})
