import React, { useState, useRef } from "react";
import backgroundImage from "./backgroundImage.jpg";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme) => ({
  appbar: {
    background: "#3f51b5",
    boxShadow: "none",
    color: "white",
  },
  mainContainer: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    height: "93vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    maxWidth: 450,
    borderRadius: 15,
    boxShadow: "0px 9px 70px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    backgroundColor: "#fff",
    padding: theme.spacing(2),
    position: "relative",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
  },
  input: {
    display: "none",
  },
  uploadIcon: {
    margin: theme.spacing(1),
  },
  cardMedia: {
    height: 300,
    width: "auto",
    margin: "auto",
    borderRadius: 10,
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  },
  clearButton: {
    marginTop: theme.spacing(2),
    backgroundColor: "#f44336",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#d32f2f",
    },
  },
  title: {
    marginBottom: theme.spacing(2),
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "1.5rem",
    color: "#333",
  },
  disclaimer: {
    marginTop: theme.spacing(2),
    fontSize: "0.9rem",
    color: "#555",
    textAlign: "center",
    marginBottom: theme.spacing(2),
  },
  resultTable: {
    marginTop: theme.spacing(2),
    backgroundColor: "#f4f4f9",
    borderRadius: 10,
  },
  resultTableCell: {
    fontWeight: "bold",
    color: "#333",
  },
  resultValueCell: {
    color: "#4caf50",
  },
  uploadButton: {
    padding: theme.spacing(2),
    backgroundColor: "#2575fc",
    borderRadius: 8,
    "&:hover": {
      backgroundColor: "#1e61c3",
    },
  },
  uploadText: {
    marginTop: theme.spacing(1),
    color: "#fff",
    fontSize: "1.2rem",
  },
}));

const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const inputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      sendFile(file);
    } else {
      setError("Unsupported file type. Please upload a JPG or PNG image.");
    }
  };

  // Send file to backend for processing
  const sendFile = async (file) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`http://localhost:8000/predict`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to process image. Please try again.");
      }

      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear uploaded data
  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setData(null);
    setError(null);
  };

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Lung Cancer Detection
          </Typography>
          <div style={{ flexGrow: 1 }} />
          <Avatar src="./logo.png" />
        </Toolbar>
      </AppBar>

      <div className={classes.mainContainer}>
        <Card className={classes.card}>
          <CardContent className={classes.content}>
            <Typography variant="h6" className={classes.title}>
              Lung Cancer Histopathological Image Classification
            </Typography>

            {preview ? (
              <CardMedia
                component="img"
                alt="Uploaded Image"
                image={preview}
                className={classes.cardMedia}
              />
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  className={classes.input}
                  onChange={handleFileUpload}
                />
                <IconButton
                  aria-label="Upload Image"
                  onClick={() => inputRef.current.click()}
                  className={classes.uploadButton}
                >
                  <CloudUploadIcon fontSize="large" />
                </IconButton>
                <Typography variant="body1" className={classes.uploadText}>
                  Upload or capture an image
                </Typography>
              </div>
            )}
          </CardContent>

          <div>
            {isLoading && (
              <CardContent>
                <CircularProgress color="secondary" />
                <Typography variant="subtitle1">Processing...</Typography>
              </CardContent>
            )}
            {data && (
              <CardContent>
                <TableContainer component={Paper} className={classes.resultTable}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell className={classes.resultTableCell}>Label</TableCell>
                        <TableCell className={classes.resultValueCell} align="right">
                          {data.class}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.resultTableCell}>Confidence</TableCell>
                        <TableCell className={classes.resultValueCell} align="right">
                          {(parseFloat(data.confidence) * 100).toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            )}
            {error && (
              <CardContent>
                <Typography color="error" variant="h6">
                  {error}
                </Typography>
              </CardContent>
            )}
          </div>

          {preview && (
            <CardContent>
              <Button
                variant="contained"
                className={classes.clearButton}
                onClick={handleClear}
                startIcon={<ClearIcon />}
              >
                Clear Image
              </Button>
            </CardContent>
          )}

          <Typography className={classes.disclaimer}>
            This tool is for educational purposes only and should not replace professional medical diagnosis.
          </Typography>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default ImageUpload;
