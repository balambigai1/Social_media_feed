import React, { useState } from "react";
import axios from "axios";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as CommentIcon,
  Send as SendIcon,
} from "@mui/icons-material";

function Post({ post, onUpdate }) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8081/api/posts/${post.id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onUpdate();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8081/api/posts/${post.id}/comments`,
        {
          content: comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComment("");
      onUpdate();
    } catch (error) {
      console.error("Error commenting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" sx={{ width: "100%", mt: 5 }} >
    <Card elevation={2} sx={{ width: "60%", minWidth: "200px" }}>
      <CardHeader
        avatar={
          <Avatar
            src={`https://ui-avatars.com/api/?name=${post.username}&background=random`}
            alt={post.username}
          />
        }
        title={
          <Typography variant="subtitle1" fontWeight="medium">
            {post.username}
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            {formatDistanceToNow(new Date(post.created_at), {
              addSuffix: true,
            })}
          </Typography>
        }
      />

      <CardContent>
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 2 }}>
          {post.content}
        </Typography>
      </CardContent>

      {post.image_url && (
        <CardMedia
          component="img"
          image={post.image_url}
          alt="Post content"
          sx={{ maxHeight: 400, objectFit: "cover" }}
        />
      )}

      <CardActions sx={{ px: 2, py: 1 }}>
        <IconButton
          onClick={handleLike}
          color={post.is_liked ? "primary" : "default"}
          size="small"
        >
          {post.is_liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
          {post.likes_count}
        </Typography>

        <IconButton size="small">
          <CommentIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {post.comments_count}
        </Typography>
      </CardActions>

      <Divider />

      {post.comments?.length > 0 && (
        <List sx={{ py: 0 }}>
          {post.comments.map((comment) => (
            <React.Fragment key={comment.id}>
              <ListItem alignItems="flex-start" sx={{ py: 1 }}>
                <ListItemAvatar>
                  <Avatar
                    src={`https://ui-avatars.com/api/?name=${comment.username}&size=32`}
                    alt={comment.username}
                    sx={{ width: 32, height: 32 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2">
                      {comment.username}
                    </Typography>
                  }
                  secondary={comment.content}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}

      <Box
        component="form"
        onSubmit={handleComment}
        sx={{ p: 2, display: "flex", gap: 1 }}
      >
        <TextField
          size="small"
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          disabled={isSubmitting}
          variant="outlined"
        />
        <Button
          type="submit"
          disabled={isSubmitting || !comment.trim()}
          variant="contained"
          size="small"
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Box>
    </Card>
    </Box>
  );
}

export default Post;
