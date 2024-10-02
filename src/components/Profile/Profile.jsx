import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserPosts, updatePost, deletePost } from '../../redux/posts/postsSlice';
import { updateUser, reset } from '../../redux/auth/authSlice';
import { Tabs, Spin, Avatar, Input, Button, Upload, notification, Card, Modal } from 'antd';
import './Profile.styled.scss';

const { Meta } = Card;

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isError, isSuccess, message } = useSelector((state) => state.auth);
  const { posts, isLoading } = useSelector((state) => state.posts);

  // State for editing profile and posts
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    username: '',
    email: '',
    profileImage: null,
    previewImageUrl: '',
    postTitle: '',
    postBody: '',
    postImage: null,
  });

  const { firstName, username, email, profileImage, previewImageUrl, postTitle, postBody, postImage } = formData;

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        username: user.username || '',
        email: user.email || '',
        previewImageUrl: user.profileImageUrl || '',
      });
      dispatch(getUserPosts(user._id)); // Load user's posts when user is present
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (isError) {
      notification.error({ message: 'Error', description: message });
    }
    if (isSuccess) {
      notification.success({ message: 'Success', description: 'Profile updated successfully' });
      setIsEditingProfile(false);
    }

    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, message, dispatch]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (info, type) => {
    if (info.fileList && info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj;
      if (type === 'profile') {
        setFormData({
          ...formData,
          profileImage: file,
          previewImageUrl: URL.createObjectURL(file),
        });
      } else if (type === 'post') {
        setFormData({
          ...formData,
          postImage: file,
        });
      }
    }
  };

  const onSubmitProfile = () => {
    const updatedData = new FormData();
    updatedData.append('firstName', firstName);
    updatedData.append('username', username);
    updatedData.append('email', email);
    if (profileImage) {
      updatedData.append('profileImage', profileImage);
    }
    dispatch(updateUser({ id: user._id, data: updatedData }));
  };

  const onSubmitPost = () => {
    const updatedData = new FormData();
    updatedData.append('title', postTitle);
    updatedData.append('body', postBody);
    
    // Always append postImage whether creating or updating a post
    if (postImage) {
      updatedData.append('image', postImage);
    }

    if (currentPost) {
      dispatch(updatePost({ id: currentPost._id, data: updatedData }))
        .unwrap()
        .then(() => {
          notification.success({ message: 'Post updated successfully' });
          resetPostForm();
          dispatch(getUserPosts(user._id)); // Refresh user's posts
          setIsEditingPost(false);
        })
        .catch((error) => {
          notification.error({ message: 'Error', description: error.message || 'Failed to update post' });
        });
    } else {
      // If it's a new post, handle the creation logic here (if you have a createPost action)
      // dispatch(createPost({ data: updatedData }));
    }
  };

  const resetPostForm = () => {
    setCurrentPost(null);
    setFormData({ ...formData, postTitle: '', postBody: '', postImage: null });
  };

  const handleEditPost = (post) => {
    setCurrentPost(post);
    setFormData({
      postTitle: post.title,
      postBody: post.body,
      postImage: null,
    });
    setIsEditingPost(true);
  };

  const handleDeletePost = (postId) => {
    dispatch(deletePost(postId))
      .unwrap()
      .then(() => {
        notification.success({ message: 'Post deleted successfully' });
        dispatch(getUserPosts(user._id)); // Refresh the user's posts
      })
      .catch((error) => {
        notification.error({ message: 'Error', description: error.message || 'Failed to delete post' });
      });
  };

  const items = [
    {
      key: '1',
      label: 'Profile',
      children: (
        <div className="profile-info">
          {isEditingProfile ? (
            <>
              <Upload
                name="profileImage"
                beforeUpload={() => false}
                onChange={(info) => handleImageChange(info, 'profile')}
                showUploadList={false}
              >
                <div>
                  <Avatar
                    src={previewImageUrl || user?.profileImageUrl}
                    size={128}
                  />
                  <span>Change Image</span>
                </div>
              </Upload>
              <Input
                name="firstName"
                value={firstName}
                onChange={handleInputChange}
                placeholder="First Name"
              />
              <Input
                name="username"
                value={username}
                onChange={handleInputChange}
                placeholder="Username"
              />
              <Input
                name="email"
                value={email}
                onChange={handleInputChange}
                placeholder="Email"
              />
              <Button type="primary" onClick={onSubmitProfile}>Save</Button>
              <Button onClick={() => setIsEditingProfile(false)}>Cancel</Button>
            </>
          ) : (
            user ? (
              <>
                <Avatar src={user.profileImageUrl} alt={user.firstName} size={128}/>
                <p><strong>Name:</strong> {user.firstName}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Seguidores:</strong> {user.followers ? user.followers.length : 0}</p>
                <p><strong>Seguidos:</strong> {user.follows ? user.follows.length : 0}</p>
                <Button type="primary" onClick={() => setIsEditingProfile(true)}>Edit Profile</Button>
              </>
            ) : (
              <p>Please log in to view your profile.</p>
            )
          )}
        </div>
      ),
    },
    {
      key: '2',
      label: 'Posts',
      children: (
        <>
          <h2>Created Posts</h2>
          {isLoading ? (
            <Spin />
          ) : posts.length > 0 ? (
            <div className="posts-list">
              {posts.map((post) => (
                <Card key={post._id} cover={post.imageUrl && <img alt={post.title} src={post.imageUrl} />}>
                  <Meta title={post.title} description={post.body} />
                  <Button onClick={() => handleEditPost(post)}>Edit</Button>
                  <Button onClick={() => handleDeletePost(post._id)}>Delete</Button>
                </Card>
              ))}
            </div>
          ) : (
            <p>No posts created by this user.</p>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <Tabs items={items} defaultActiveKey="1" />

      <Modal
        title={currentPost ? "Edit Post" : "Create New Post"}
        open={isEditingPost}
        onCancel={() => {
          setIsEditingPost(false);
          resetPostForm();
        }}
        footer={null}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmitPost();
        }}>
          <Input
            name="postTitle"
            value={postTitle}
            onChange={handleInputChange}
            placeholder="Post Title"
          />
          <Input.TextArea
            name="postBody"
            value={postBody}
            onChange={handleInputChange}
            placeholder="Post Body"
          />
          <Upload
            name="postImage"
            beforeUpload={() => false}
            onChange={(info) => handleImageChange(info, 'post')}
            showUploadList={false}
          >
            <Button>Upload Image</Button>
          </Upload>
          
          {currentPost && currentPost.imageUrl && !postImage && (
            <div>
              <img src={currentPost.imageUrl} alt="Current Post"/>
              <span>Current Image</span>
            </div>
          )}
          
          {postImage && (
            <div>
              <img src={URL.createObjectURL(postImage)} alt="Post Preview"/>
              <Button onClick={() => setFormData({ ...formData, postImage: null })} type="danger">Delete Image</Button>
            </div>
          )}

          <div>
            <Button type="primary" htmlType="submit">Submit</Button>
            <Button onClick={() => resetPostForm()}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
