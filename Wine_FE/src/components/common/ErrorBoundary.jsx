import { Component } from "react";
import { Box, Typography, Button, Paper, Container } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />

            <Typography variant="h4" gutterBottom>
              Něco se pokazilo
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph>
              Došlo k neočekávané chybě v aplikaci. Prosím, zkuste stránku
              obnovit nebo se vraťte na dashboard.
            </Typography>

            {process.env.NODE_ENV === "development" && (
              <Box
                sx={{
                  mt: 4,
                  textAlign: "left",
                  bgcolor: "grey.900",
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: "error.main" }}
                >
                  {this.state.error && this.state.error.toString()}
                </Typography>
                <Typography
                  variant="caption"
                  component="pre"
                  sx={{ whiteSpace: "pre-wrap", color: "grey.400" }}
                >
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </Typography>
              </Box>
            )}

            <Box
              sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}
            >
              <Button variant="outlined" onClick={this.handleReset}>
                Zkusit znovu
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Přejít na přehled
              </Button>
            </Box>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
