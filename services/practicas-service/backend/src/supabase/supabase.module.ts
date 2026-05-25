import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Global()
@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('SUPABASE_URL');
        const anonKey = configService.get<string>('SUPABASE_ANON_KEY');
        if (!url || !anonKey) {
          throw new Error('SUPABASE_URL o SUPABASE_ANON_KEY no definidas');
        }
        console.log('✅ Supabase client inicializado correctamente');
        return createClient(url, anonKey);
      },
    },
  ],
  exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule {}