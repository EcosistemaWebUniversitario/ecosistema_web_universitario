Cada equipo debe crear su servicio asi :
service-name/
│
├── src/
│   ├── config/
│   │   └── supabase.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── role.middleware.ts
│   │
│   ├── modules/
│   │   └── example/
│   │       ├── example.controller.ts
│   │       ├── example.service.ts
│   │       └── example.routes.ts
│   │
│   ├── routes/
│   │   └── index.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env
├── package.json
└── tsconfig.json

1- Configuracion de supabase:
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

2- Middleware de autenticacion (obligatorio)
src/middlewares/auth.middleware.ts:
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

type AuthRequest = Request & {
  user?: any;
};

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        ok: false,
        message: 'Token requerido'
      });
    }

    const token = authHeader.split(' ')[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        ok: false,
        message: 'Token inválido'
      });
    }

    req.user = data.user;
    next();
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      message: error.message
    });
  }
};

3) 🔒 Middleware de roles
src/middlewares/role.middleware.ts:
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

type AuthRequest = Request & {
  user?: any;
};

export const requireRole = (...allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          ok: false,
          message: 'Unauthorized'
        });
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role_id')
        .eq('id', req.user.id)
        .single();

      const { data: role } = await supabase
        .from('roles')
        .select('name')
        .eq('id', profile?.role_id)
        .single();

      if (!role || !allowedRoles.includes(role.name)) {
        return res.status(403).json({
          ok: false,
          message: 'Forbidden'
        });
      }

      next();
    } catch (error: any) {
      return res.status(500).json({
        ok: false,
        message: error.message
      });
    }
  };
};


4) 🧠 Ejemplo de módulo
modules/example/example.service.ts:
export const getExampleData = async () => {
  return [
    { id: 1, name: 'Ejemplo 1' },
    { id: 2, name: 'Ejemplo 2' }
  ];
};

modules/example/example.controller.ts:
import { Request, Response } from 'express';
import { getExampleData } from './example.service';

export const getExamples = async (_req: Request, res: Response) => {
  const data = await getExampleData();

  res.json({
    ok: true,
    data
  });
};

modules/example/example.routes.ts:
import { Router } from 'express';
import { getExamples } from './example.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', requireAuth, getExamples);

export default router;

5) 📦 Rutas principales
src/routes/index.ts:
import { Router } from 'express';
import exampleRoutes from '../modules/example/example.routes';

const router = Router();

router.use('/example', exampleRoutes);

export default router;

6) 🚀 App
src/app.ts:
import express from 'express';
import routes from './routes';

const app = express();

app.use(express.json());

app.use('/api', routes);

export default app;

src/server.ts:
import app from './app';
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});



 7) ⚙️ .env
 PORT=4002
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key

8) 📦 package.json (mínimo)
 {
  "name": "microservice",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node-dev src/server.ts"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2",
    "express": "^4",
    "dotenv": "^16"
  },
  "devDependencies": {
    "ts-node-dev": "^2",
    "typescript": "^5"
  }
}

REGLAS PARA TU EQUIPO (IMPORTANTÍSIMO)
Compárteles esto tal cual:
 • Todos los servicios deben usar requireAuth
 • Todos deben validar roles si aplica
 • Todos deben usar la misma estructura
 • Todos deben usar /api como prefijo
 • Ningún servicio maneja login (solo auth-service)

