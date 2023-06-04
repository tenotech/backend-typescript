import express from 'express';
import * as fs from 'fs';
import cors from 'cors';

interface LanguageOption {
  value: string;
  label: string;
}

interface MonthOption {
  value: string;
  label: string;
}

interface User {
  name: string;
  language: string;
  month: string;
  accept: boolean;
}

interface TableData {
  languageOptions: LanguageOption[];
  monthOptions: MonthOption[];
  users: User[];
}

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/data', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data.json:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!data) {
      console.error('data.json is empty or does not exist');
      return res.status(404).json({ error: 'Data not found' });
    }

    const tableData: TableData = JSON.parse(data);
    res.json(tableData);
  });
});

app.put('/api/data/user', (req, res) => {
  const { name, language, month, accept } = req.body;

  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data.json:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!data) {
      console.error('data.json is empty or does not exist');
      return res.status(404).json({ error: 'Data not found' });
    }

    const tableData: TableData = JSON.parse(data);

    const userIndex = tableData.users.findIndex((user) => user.name === name);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    tableData.users[userIndex] = {
      ...tableData.users[userIndex],
      language,
      month,
      accept,
    };

    fs.writeFile('data.json', JSON.stringify(tableData), 'utf8', (err) => {
      if (err) {
        console.error('Error writing data to data.json:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json({ message: 'Data updated successfully' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
