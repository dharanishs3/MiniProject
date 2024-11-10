/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: 'postgresql://ai-interview_owner:lVtnMvYN80Zy@ep-bold-haze-a11vp9gg.ap-southeast-1.aws.neon.tech/ai-interview?sslmode=require'
  }
};