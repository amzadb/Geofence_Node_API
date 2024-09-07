const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const Geofence = require('./Geofence');
const app = express();
const port = 3000;

app.use(bodyParser.json());

let geofences = [];

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Geofence API',
      version: '1.0.0',
      description: 'API for managing geofences',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./index.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     Geofence:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - longitude
 *         - latitude
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the geofence
 *         name:
 *           type: string
 *           description: The name of the geofence
 *         longitude:
 *           type: number
 *           description: The longitude of the geofence
 *         latitude:
 *           type: number
 *           description: The latitude of the geofence
 *       example:
 *         id: 1
 *         name: Central Park
 *         longitude: -73.968285
 *         latitude: 40.785091
 */

/**
 * @swagger
 * tags:
 *   name: Geofences
 *   description: The geofence managing API
 */

/**
 * @swagger
 * /geofence:
 *   post:
 *     summary: Create a new geofence
 *     tags: [Geofences]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Geofence'
 *     responses:
 *       201:
 *         description: The geofence was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Geofence'
 *       500:
 *         description: Some server error
 */
app.post('/geofence', (req, res) => {
  const { id, name, longitude, latitude } = req.body;
  const geofence = new Geofence(id, name, longitude, latitude);
  geofences.push(geofence);
  res.status(201).send(geofence.getDetails());
});

/**
 * @swagger
 * /geofences:
 *   get:
 *     summary: Returns the list of all the geofences
 *     tags: [Geofences]
 *     responses:
 *       200:
 *         description: The list of the geofences
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Geofence'
 */
app.get('/geofences', (req, res) => {
  res.send(geofences.map(g => g.getDetails()));
});

/**
 * @swagger
 * /geofence/{id}:
 *   get:
 *     summary: Get the geofence by id
 *     tags: [Geofences]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The geofence id
 *     responses:
 *       200:
 *         description: The geofence description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Geofence'
 *       404:
 *         description: The geofence was not found
 */
app.get('/geofence/:id', (req, res) => {
  const geofence = geofences.find(g => g.id === parseInt(req.params.id));
  if (geofence) {
    res.send(geofence.getDetails());
  } else {
    res.status(404).send({ message: 'Geofence not found' });
  }
});

/**
 * @swagger
 * /geofence/{id}:
 *   put:
 *     summary: Update the geofence by the id
 *     tags: [Geofences]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The geofence id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Geofence'
 *     responses:
 *       200:
 *         description: The geofence was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Geofence'
 *       404:
 *         description: The geofence was not found
 *       500:
 *         description: Some error happened
 */
app.put('/geofence/:id', (req, res) => {
  const { name, longitude, latitude } = req.body;
  const geofence = geofences.find(g => g.id === parseInt(req.params.id));
  if (geofence) {
    geofence.name = name;
    geofence.longitude = longitude;
    geofence.latitude = latitude;
    res.send(geofence.getDetails());
  } else {
    res.status(404).send({ message: 'Geofence not found' });
  }
});

/**
 * @swagger
 * /geofence/{id}:
 *   delete:
 *     summary: Remove the geofence by id
 *     tags: [Geofences]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The geofence id
 *     responses:
 *       204:
 *         description: The geofence was deleted
 *       404:
 *         description: The geofence was not found
 */
app.delete('/geofence/:id', (req, res) => {
  const index = geofences.findIndex(g => g.id === parseInt(req.params.id));
  if (index !== -1) {
    geofences.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send({ message: 'Geofence not found' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello, World! This is for Geofence.');
});

app.get('/geofence', (req, res) => {
  res.send(geofence.getDetails());
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});