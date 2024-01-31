#Use an official runtime as a parent image
FROM node:20-alpine

#Set the working directory in the container
WORKDIR /usr/src/app

#Copy the current directory contents into the container at /usr/src/app
COPY . .