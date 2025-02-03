the music record solution contains 3 projects:
1. musicrecord.client: Frontend application developed in React
2. MusicRecord.Server: API developed in C# .Net Core
3. MusicRecord.Server.Tests: xUnit test for the API
Also a postman collection is available at the root.

to run the solution locally you will need 
1. visual studio 2022
2. local MSSQL database

the steps required to run the project are:
1. clone the repo to VS 2022
2. in project "MusicRecord.Server" update the connection string in "appsettings.json" to point to your local database.
3. open package manager console by selectin Tools -> NuGet Package manager - >  package manager console
4. run database migration in package manager console by typing ==> update-database
5. start the projects and wait for the API page to load then refresh the frontend application page


