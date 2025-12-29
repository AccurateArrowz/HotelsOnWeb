// In-memory "database"
const posts = [
    {
      postId: 0,
      userId: 101,
      userName: "Aarav Sharma",
      content: "Just came back from an amazing trek in the Himalayas! 🏔️",
      createdAt: "2025-09-15T10:23:00Z",
      likes: 120,
      comments: 15
    },
    {
      postId: 1,
      userId: 102,
      userName: "Emily Carter",
      content: "Baked homemade chocolate chip cookies today 🍪 Who wants some?",
      createdAt: "2025-09-15T13:45:00Z",
      likes: 78,
      comments: 10
    },
    {
      postId: 2,
      userId: 103,
      userName: "David Kim",
      content: "Just finished a 10k run! Feeling accomplished 🏃‍♂️",
      createdAt: "2025-09-16T06:30:00Z",
      likes: 54,
      comments: 7
    },
    {
      postId: 3,
      userId: 104,
      userName: "Sophia Martinez",
      content: "Watching the sunset at the beach 🌅 Life is beautiful.",
      createdAt: "2025-09-16T07:15:00Z",
      likes: 89,
      comments: 12
    },
    {
      postId: 4,
      userId: 105,
      userName: "Liam Johnson",
      content: "Just launched my first mobile app! So excited 📱🚀",
      createdAt: "2025-09-16T08:00:00Z",
      likes: 140,
      comments: 25
    }
  ];
  
let nextId = posts.length;

exports.getAllPosts = (req, res) => {
  res.json(posts);
};

exports.getPostById = (req, res) => {
  console.log('Requested for post with id: ' + req.params.id)
  const post = posts.find(p => p.postId === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: 'Post not found' });
  console.log(post);
  res.json(post);
};

exports.createPost = (req, res) => {
  const { title, content, author} = req.body;
  if (!title || !content || !author) return res.status(400).json({ message: 'All fields are required ' });

  const newPost = { postId: nextId++, userId: 0, userName: author || 'Anonymous', content, createdAt: new Date().toISOString(), likes: 0, comments: 0, title: title || '' };
  posts.push(newPost);
  res.status(201).json(newPost);
};

exports.updatePost = (req, res) => {
  const post = posts.find(p => p.postId === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const { title, content } = req.body;
  if (title) post.title = title;
  if (content) post.content = content;
  res.json(post);
};

exports.deletePost = (req, res) => {
  const index = posts.findIndex(p => p.postId === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Post not found' });

  posts.splice(index, 1);
  res.json({ message: 'Post deleted successfully' });
};
