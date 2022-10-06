'use strict';

/**
 * post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::post.post", ({ strapi }) => ({
    // Method 1: Creating an entirely custom action
    async exampleAction(ctx) {
        // await strapi.service("api::post.post").exampleService()
        try {
            ctx.body = "ok";
        } catch (err) {
            ctx.body = err;
        }
    },

    // Solution 1: fetch all  posts and filtered
    // async find(ctx) {
    //     // fetch all posts
    //     const { data, meta } = await super.find(ctx);
    //     if (ctx.state.user) return { data, meta };
    //     // not authenticated user
    //     const filteredData = data.filter(post => !post.attributes.premium);
    //     return { data: filteredData, meta }
    // },

    // Solution 2: rewite the action to fetch only needed posts
    // async find(ctx) {
    //     // if the request is authenticated
    //     const isRequestingNonePremium = ctx.query.filteres && ctx.query.filteres.premium == false;
    //     if (ctx.state.user || isRequestingNonePremium) return await super.find(ctx)
    //     //if the request is public
    //     // let's call the underlying service with an additonal filter param
    //     // /posts?filteres[permium]=false
    //     const {query} = ctx
    //     const filteredPost = await strapi.service("api::post.post").find({
    //         ...query,
    //         filters: {
    //             ...query.filteres,
    //             premium: false
    //         }
    //     });
    //     const sanitizedEntity = await this.sanitizeOutput(filteredPost, ctx);
    //     return this.transformResponse(sanitizedEntity);
    // },

    // Solution 3: rewite the action to fetch only needed posts
    async find(ctx) {
        // if the request is authenticated
        const isRequestingNonePremium = ctx.query.filteres && ctx.query.filteres.premium == false;
        if (ctx.state.user || isRequestingNonePremium) return await super.find(ctx)
        //if the request is public
        const publicPosts = await strapi.service("api::post.post").findPublic(ctx.query)
        const sanitizedEntity = await this.sanitizeOutput(publicPosts, ctx);
        return this.transformResponse(sanitizedEntity);
    },

    // Method 3: Replacing a core action
    // async findOne(ctx) {
    //     const { id } = ctx.params;
    //     const { query } = ctx;

    //     const entity = await strapi
    //         .service("api::post.post")
    //         .findOne(id, query);
    //     const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    //     return this.transformResponse(sanitizedEntity);
    // },
    async findOne(ctx) {
        if (ctx.state.user) return await super.findOne(ctx)
        const { id } = ctx.params;
        const { query } = ctx;
        const postIfPublic = await strapi.service("api::post.post").findOneIfPublic({ id, query });
        const sanitizedEntity = await this.sanitizeOutput(postIfPublic, ctx);
        return this.transformResponse(sanitizedEntity);
    },
    async likePost(ctx) {
        const user = ctx.state.user;
        const postId = ctx.params.id;
        const { query } = ctx;
        console.log({ postId, userId: user.id, query });
        const updatedPost = await strapi.service("api::post.post").likePost({ postId, userId: user.id, query })
        const sanitizedEntity = await this.sanitizeOutput(updatedPost, ctx);
        return this.transformResponse(sanitizedEntity);
    }
}));
