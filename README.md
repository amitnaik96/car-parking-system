## **Car Parking System API**  
This is a RESTful API built using **NestJS** that simulates a car parking lot management system.

## **Installation**  
### **Local**
```bash
    # clone the repo
    git clone https://github.com/amitnaik96/car-parking-system.git
    cd car-parking-system

    # install dependencies and add .env file (refer .env.example)
    npm install
    
    # run the backend  
    npm run start:dev

    # run the tests
    npm run test
```

### **Docker**

```bash
  # build the image
  docker build -t parking-app .

  # run the container
  docker run -p 3000:3000 -d parking-app 
```

**OR**
```bash
  docker-compose up
```

### **API Docs**
Visit `http://localhost:3000/api/docs` for the documentation 

### **Deployed**
- **Has been deployed at render(free) may get rate limited**  
`https://car-parking-system-73rd.onrender.com/api/docs`

