<?php

namespace Database\Seeders;

use App\Models\Barangay;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BarangaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
     public function run(): void
    {
        $barangays = [
            'Centro – San Antonio', 'Aggasian', 'Alibagu', 'Alinguigan 1st', 'Alinguigan 2nd', 'Alinguigan 3rd',
            'Arusip', 'Baculud (Poblacion)', 'Bagong Silang', 'Bagumbayan (Poblacion)', 'Baligatan',
            'Ballacong', 'Bangag', 'Batong-Labang', 'Bigao', 'Cabannungan 1st',
            'Cabannungan 2nd', 'Cabeseria 2 (Dappat)', 'Cabeseria 3 (San Fernando)', 'Cabeseria 4 (San Manuel)',
            'Cabeseria 5 (Baribad)', 'Cabeseria 6 & 24 (Villa Marcos)', 'Cabeseria 7 (Nangalisan)', 'Cabeseria 9 & 11 (Capogotan)',
            'Cabeseria 10 (Lupigui)', 'Cabeseria 14 & 16 (Casilagan)', 'Cabeseria 17 & 21 (San Rafael)', 'Cabeseria 19 (Villa Suerte)',
            'Cabeseria 22 (Sablang)', 'Cabeseria 23 (San Francisco)', 'Cabeseria 25 (Santa Lucia)', 'Cabeseria 27 (Abuan)', 'Cadu',
            'Calamagui 1st', 'Calamagui 2nd', 'Camunatan', 'Capellan', 'Capo',
            'Carikkikan Norte', 'Carikkikan Sur',  'Centro Poblacion', 'Fugu',
            'Fuyo', 'Gayong-Gayong Norte', 'Gayong-Gayong Sur', 'Guinatan', 'Imelda Bliss Village',
            'Lullutan', 'Malalam', 'Malasin (Angeles)', 'Manaring', 'Mangcuram',
            'Marana I', 'Marana II', 'Marana III', 'Minabang', 'Morado',
            'Naguilian Norte', 'Naguilian Sur', 'Namnama', 'Nanaguan', 'Osmeña (Sinippil)',
            'Paliueg', 'Pasa', 'Pilar', 'Quimalabasa', 'Rang-ayan (Bintacan)',
            'Rugao', 'Salindingan', 'San Andres (Angarilla)', 'San Felipe', 'San Ignacio (Canapi)',
            'San Isidro', 'San Juan', 'San Lorenzo', 'San Pablo', 'San Rodrigo',
            'San Vicente (Poblacion)', 'Santa Barbara (Poblacion)', 'Santa Catalina', 'Santa Isabel Norte', 'Santa Isabel Sur',
            'Santa Maria (Cabeseria 8)', 'Santa Victoria', 'Santo Tomas', 'Siffu', 'Sindon Bayabo',
            'Sindon Maride', 'Sipay', 'Tangcul', 'Villa Imelda (Maplas)'
        ];

        foreach ($barangays as $name) {
            Barangay::factory()->create([
                'barangay_name' => $name,
                'city' => 'City of Ilagan',
                'province' => 'Isabela',
                'zip_code' => '3300',
                'founded_year' => fake()->numberBetween(1901, 1990),
                'barangay_code' => fake()->numerify('###-######'),
                'barangay_type' => fake()->randomElement(['rural', 'urban']),
                'contact_number' => fake()->numerify('09#########'),
                'area_sq_km' => fake()->randomFloat(2, 1, 20),
                'email' => fake()->safeEmail(),
                'logo_path' => null,
            ]);
        }
    }
}
