# 🎨 ImagineX - AI Text-to-Image Generator

![Demo Screenshot Placeholder](https://via.placeholder.com/1200x600?text=ImagineX+AI+Generation)

ImagineX is a premium, high-performance web application that transforms your textual descriptions into stunning visual masterpieces using state-of-the-art AI models. Built with **React** and powered by the **Hugging Face Inference API**, ImagineX offers a seamless, glassmorphic interface designed to inspire creativity.

## ✨ Key Features

-   **AI-Powered Generation**: Leverages Stable Diffusion v1.5 for high-quality image generation.
-   **Premium Glassmorphic UI**: Beautiful, modern design with smooth animations and gradients.
-   **One-Click Download**: Instantly save your generated masterpieces to your device.
-   **API Key Management**: Securely manage your Hugging Face API token with client-side persistence.
-   **Fully Responsive**: Optimised for desktops, tablets, and mobile devices.
-   **Real-time Feedback**: Live loading states and error handling for a smooth user experience.

## 🚀 Getting Started

To get started with ImagineX locally, follow these steps:

### Prerequisites

-   **Node.js**: Ensure you have Node.js installed.
-   **Hugging Face API Token**: You'll need a free API token from Hugging Face.
    1.  Create an account at [huggingface.co](https://huggingface.co/join).
    2.  Go to [Settings -> Tokens](https://huggingface.co/settings/tokens).
    3.  Create a new token with "Read" access.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/text-to-image.git
    cd text-to-image
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm start
    ```

4.  Enter your Hugging Face API token in the application settings (⚙️ icon) and start generating!

## 🛠️ Deployment

This project is fully ready to be deployed to **GitHub Pages**, **Vercel**, or **Netlify**.

### Deploying to GitHub Pages

1.  Install the `gh-pages` package:
    ```bash
    npm install gh-pages --save-dev
    ```

2.  Add `homepage` to `package.json`:
    ```json
    "homepage": "https://your-username.github.io/text-to-image"
    ```

3.  Add the following scripts:
    ```json
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
    ```

4.  Run the deploy command:
    ```bash
    npm run deploy
    ```

## 🔒 Privacy & Security

ImagineX is a client-side application. Your prompts and API tokens are never sent to our servers; they only interact directly with the Hugging Face API. Your token is stored locally in your browser's `localStorage` for your convenience.

## 📄 License

This project is licensed under the MIT License.
