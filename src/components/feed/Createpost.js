import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useState } from "react";
import { Plus } from  'lucide-react';

const CreatePost = ({ onNewPost }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
      setOpen(false);
      setContent("");
      setImage(null);
      setError("");
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate content
    if (!content || !content.trim()) {
      setError("Post content cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const postData = {
        content: content.trim(),
        image: null,
      };

      if (image) {
        // Convert image to base64
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            postData.image = reader.result;
            await onNewPost(postData);

            // Reset form after successful submission
            setContent("");
            setImage(null);
            setIsSubmitting(false);
          } catch (err) {
            setError("Failed to create post with image");
            setIsSubmitting(false);
          }
        };
        reader.onerror = () => {
          setError("Failed to process image");
          setIsSubmitting(false);
        };
        reader.readAsDataURL(image);
      } else {
        // Submit without image
        await onNewPost(postData);

        // Reset form after successful submission
        setContent("");
        setImage(null);
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("Failed to create post");
      setIsSubmitting(false);
    }
    handleClose(); //
  };

  return (
    <>
      <div>
        <Box display="flex" justifyContent="flex-end" mx={5} my={2}>
          <Button className='ml-auto' variant="contained" color="primary" onClick={handleOpen}>
            Create Post
            <Plus size={16} />
          </Button>
        </Box>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded-lg shadow"
          >
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            <DialogTitle>Create a Post</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                multiline
                minRows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                variant="outlined"
                margin="dense"
              />
              <div className="flex items-center justify-between">
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && !file.type.startsWith("image/")) {
                      setError("Please select an image file");
                      return;
                    }
                    setImage(file);
                  }}
                  accept="image/*"
                  className="text-sm"
                />
              </div>
              <DialogActions className="flex justify-end">
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  color="primary"
                  variant="contained"
                >
                  Post
                </Button>
              </DialogActions>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </>
  );
};

export default CreatePost;
