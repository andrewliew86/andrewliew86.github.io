## Selected data science, AI and text analytics projects

---
### Melbourne property price prediction API

This POC project provides a Flask-based API for predicting house prices using a Random Forest regressor. The model, trained using data scraped from a real estate website, outputs predictions based on input features like building type, area, rooms, and garage availability. The app is containerized using Docker for easy deployment and scalability.

<img src="images/melbourne-property-collage.png?raw=true"/>

[View project on GitHub](https://github.com/andrewliew86/Melbourne-property-price-prediction-model)

---
### Chatting with scientific documents using large language models

Scientific papers are often long and contain technical jargon. In this proof of concept project, I utilized several open access Python libraries (LangChain, Hugging Face/Transformers) and open-weights large language models (Mistral-7B and Zephyr-7B-Beta) to create ChatGPT-like chatbots that can summarize and answer questions from an uploaded scientific PDF document.  

[View project on GitHub](https://github.com/andrewliew86/Document-chatbot-with-large-language-models)

---
### Fine-tuning AI models for biomedical text analysis

Pre-trained language models such as BERT can often be fine-tuned on biomedical data to improve their ability to perform domain-specific tasks. In this project, I fine-tuned a small BERT uncased model to perform text classification and extractive Q&A using the Hugging Face/Transformers library in Python.  

<img src="images/streamlit-image.PNG?raw=true"/>

[View project on GitHub](https://github.com/andrewliew86/Deep-learning-tools-for-biomedical-text/tree/main)

---
### Deploying an open source text-to-image model as a serverless endpoint

Stable Diffusion 2 is a cutting-edge, open source, text-to-image model capable of generating high-quality images from textual descriptions. In this fun weekend project, I deployed Stable Diffusion 2 as a serverless endpoint on RunPod (via a Docker image), leveraging its cloud GPU resources to handle real-time image generation. This setup enables efficient, scalable, and cost-effective deployment, making it easy to integrate AI-driven image generation into various applications.

<img src="images/photo-collage-wide.png?raw=true"/>

[View project on GitHub](https://github.com/andrewliew86/Text-to-image-generation-model-deployment)

---
### Expert profiling platform

Bibliometrics often allows a researcher to quickly and quantitatively identify prominent, highly published authors who are likely to be leaders in the field. In this project, I use R, VOSviewer and open-source data from EuropePMC to identify these experts.  

<img src="images/network_plot2.png?raw=true"/>

[View project on GitHub](https://github.com/andrewliew86/Basic-expert-identification-profiling-app-with-R)

---
### Building an R Shiny dashboard for clinical trial insights

In this project, I developed an interactive R Shiny dashboard that provides insights into infection-related clinical trials. Using data from the AACT database, I restored the dataset into a PostgreSQL instance running in a Docker container and extracted relevant data via SQL queries. The dashboard allows users to quickly explore trial sponsors, phases and geographic distribution, offering a comprehensive view of the clinical trial landscape. This project showcases how to efficiently analyze large datasets and present actionable insights in a user-friendly interface.

<img src="images/dashboard.PNG?raw=true"/>

[View project on GitHub](https://github.com/andrewliew86/rshiny-clinical-trial-dashboard)

---
### Text analysis of pet adoption websites

Adopting a pet can be a daunting experience without proper research. The aim of this project was to determine the key themes in the description of cats that were available for adoption in Melbourne using methods such as LDA topic modelling and Scattertext in Python. I also experimented with basic machine learning models to determine factors that could influence adoption fees.

<img src="images/scatter-text.png?raw=true"/>

[View project on GitHub](https://github.com/andrewliew86/Cat-adoption-text-analysis-and-fee-prediction/tree/main)

---
## Selected posters presented at conferences

- Wager K., Wang Y., Liew A., Campbell D., Fettig L., Liu F., Martini J-F., Ziaee N., Liu Y. Using bioinformatics and artificial intelligence (AI) to map the cyclin-dependent kinase 4/6 inhibitor (CDK4/6i) translational biomarker landscape. Poster presented at the Annual ESMO Breast Cancer Congress, Berlin, Germany, 2023

- Rawlings H., Rees T., Koti L., Pal A., Liew A., Why did it go viral? An informatics-based case study of exaggerated language in news and social media. Poster presented at the European Meeting of the International Society for Medical Publication Professionals (ISMPP), London, UK, 2023

- Banner S., Rees T., Liew A., Brown N., Dhanky V., Humphreys L., Naimy H., Peters D., Young F., Factors influencing pharmaceutical industry-affiliated clinical trial publication timelines. Poster presented at the 19th Annual Meeting of the International Society for Medical Publication Professionals (ISMPP), Washington, DC, USA, 2023
  
---


