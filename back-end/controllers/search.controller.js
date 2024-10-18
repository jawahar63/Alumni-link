// searchController.js

import Post from "../models/post.js";
import User from "../models/user.js";

export const autoSuggest = async (req, res) => {
    try {
        const searchTerm = req.query.q;
        const alumniRoleId = '663c71fda7179036de1d8dd5';
        const posts = await Post.find({
            $or: [
                { caption: { $regex: searchTerm, $options: 'i' } },
                { tags: { $in: [searchTerm] } }
            ]
        }).select('_id caption tags author').populate('author', 'username');

        const users = await User.find({
            roles: { $in: [alumniRoleId] },
            username: { $regex: searchTerm, $options: 'i' }
        }).select('_id username profileImage domain batch company');

        const suggestions = [
            ...posts.map(post => ({ type: 'post', 
                id: post._id, 
                caption: post.caption, 
                tags: post.tags ,
                author: post.author.username })),
            ...users.map(user => ({ 
                type: 'user', 
                id: user._id, 
                username: user.username,
                profileImage: user.profileImage,
                domain: user.domain,
                batch: user.batch,
                company: user.company 
            }))
        ];

        res.status(200).json(suggestions);

    } catch (error) {
        res.status(500).json({ message: 'Error in auto-suggest', error });
    }
};
