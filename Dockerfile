FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /src
COPY ["/my8ProgramingBlogClient.csproj", "my8ProgramingBlogClient/"]
RUN dotnet restore "my8ProgramingBlogClient/my8ProgramingBlogClient.csproj"
COPY . .
WORKDIR "/src/my8ProgramingBlogClient"
COPY . .
RUN dotnet build "my8ProgramingBlogClient.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "my8ProgramingBlogClient.csproj" -c Release -o /app

#react build
FROM node as nodebuilder

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH


# install and cache app dependencies
COPY /package.json /usr/src/app/package.json
RUN npm install


# add app

COPY ClientApp/. /usr/src/app

RUN npm build

#End react build

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
RUN mkdir -p /app/ClientApp/dist
COPY --from=nodebuilder /usr/src/app/. /app/ClientApp/dist/
ENTRYPOINT ["dotnet", "my8ProgramingBlogClient.dll"]
