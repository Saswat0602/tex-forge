FROM ubuntu:24.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies required for tectonic and nodejs
RUN apt-get update && apt-get install -y \
    curl \
    fontconfig \
    libfontconfig1 \
    libgraphite2-3 \
    libharfbuzz-icu0 \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Install Tectonic
RUN curl --proto '=https' --tlsv1.2 -fsSL https://drop-sh.fullyjustified.net | sh && \
    mv tectonic /usr/local/bin/

# Pre-warm the Tectonic cache with common packages
RUN echo '\\documentclass{article}\\usepackage{amsmath,graphicx,hyperref,geometry,amsfonts,amssymb,babel,xcolor,tikz}\\begin{document}Hello\\end{document}' > /tmp/warmup.tex && \
    tectonic /tmp/warmup.tex && \
    rm /tmp/warmup.tex

WORKDIR /app

# Copy package.json and install
COPY package.json ./
RUN npm install

# Copy server code
COPY server.js ./

EXPOSE 4000

CMD ["npm", "start"]
