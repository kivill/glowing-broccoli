FROM ubuntu:18.04 
RUN apt-get update && apt-get install -y --no-install-recommends \
    automake \
    build-essential \
    ca-certificates \
    curl \
    git \
    libcurl3-dev \
    libfreetype6-dev \
    libpng-dev \
    libtool \
    libzmq3-dev \
    mlocate \
    openjdk-8-jdk\
    openjdk-8-jre-headless \
    pkg-config \
    python-dev \
    software-properties-common \
    swig \
    unzip \
    wget \
    zip \
    zlib1g-dev \
    python3-distutils \
    && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN curl -fSsL -O https://bootstrap.pypa.io/get-pip.py && \
    python3 get-pip.py && \
    rm get-pip.py

# Install python 3.7.
RUN add-apt-repository ppa:deadsnakes/ppa && \
    apt-get update && apt-get install -y \
    python3.8 python3.8-dev python3-pip python3.8-venv && \
    rm -rf /var/lib/apt/lists/* && \
    python3.8 -m pip install pip --upgrade && \
    update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.8 0

# Make python3.7 the default python version
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3.8 0
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .
EXPOSE 3002
CMD [ "python", "test.py" ]