SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict eYztJSSxid6sJvfZrColPEsepsblosIHgeOjiwOotvNJshwHbGbO6RFT8TYKXAJ

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: amenities; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."amenities" ("id", "name", "slug", "description", "logo_url", "created_at", "updated_at") VALUES
	('bacc4562-5a78-4372-a60f-91f5fcc805c0', 'Metro Station', 'metro-station', '', '{"url": "https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/amenity-logos/logos/faec2f05-c8b8-42f2-a68c-28576bb4d6ae.svg", "alt_tag": "Tram Front"}', '2026-04-07 05:49:48.747083+00', '2026-04-07 05:49:48.747083+00'),
	('c1c9246f-b3cb-451a-891c-465c4ca4c0af', 'Budget Friendly', 'budget-friendly', '', '{"url": "https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/amenity-logos/logos/d622ea85-d0b3-4767-9fbc-a5fcfc456354.svg", "alt_tag": "Circle Dollar Sign"}', '2026-04-07 09:07:10.562053+00', '2026-04-07 09:07:10.562053+00'),
	('a2216897-5adf-43c5-9daf-fdaf9b147d66', 'Green Areas', 'green-areas', 'testt', '{"url": "https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/amenity-logos/logos/ad23ace5-9896-4db3-bc89-d9c3a66ee0a2.svg", "alt_tag": "Tree Pine"}', '2026-04-03 08:13:56.889586+00', '2026-04-08 05:24:38.206264+00');


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."cities" ("id", "name", "slug", "description", "logo_url", "created_at", "updated_at") VALUES
	('17014caa-48d2-4203-8e11-e8fe74db1459', 'Dubai', 'dubai', 'The largest and most populous city in the United Arab Emirates, known for its modern architecture, luxury shopping, and vibrant nightlife. Home to the world''s tallest building, the Burj Khalifa.', '{"url": "https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/city-logos/cities/5db5635d-19e0-4977-a509-804f04761faf.svg", "alt_tag": "Flag Of Dubai"}', '2026-04-02 06:24:25.972015+00', '2026-04-03 04:13:18.771669+00'),
	('4c52ed42-5b8d-4e49-bf85-77ba75074210', 'Abu Dhabi', 'abu-dhabi', '', '{"url": "https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/city-logos/cities/4045e64e-8f21-46a2-a492-7598dda444a1.svg", "alt_tag": "Flag Of Abu Dhabi"}', '2026-04-03 12:07:23.789639+00', '2026-04-03 12:07:23.789639+00'),
	('727d3534-ce4a-4438-8f6c-d1e042d40b91', 'Sharjah', 'sharjah', 'The cultural capital of the UAE, known for its museums, Islamic architecture, and commitment to arts and heritage. A UNESCO Cultural Capital of the Arab World.', NULL, '2026-04-07 06:41:51.949936+00', '2026-04-07 06:41:51.949936+00'),
	('c70d2309-1be3-44ec-8db8-eecffd1dcd49', 'Ajman', 'ajman', 'The smallest of the seven emirates, known for its beautiful beaches, traditional souks, and growing real estate market. Offers a more relaxed lifestyle close to Dubai.', NULL, '2026-04-07 06:41:51.949936+00', '2026-04-07 06:41:51.949936+00'),
	('c3137ec1-50b0-48ea-ae17-81bcf58bab58', 'Ras Al Khaimah', 'ras-al-khaimah', 'The northernmost emirate, known for its stunning mountains, pristine beaches, and adventure tourism. A rapidly developing destination with rich history and natural beauty.', NULL, '2026-04-07 06:41:51.949936+00', '2026-04-07 06:41:51.949936+00'),
	('f18c6c6b-5ecd-4ff6-9ddd-df48a033c08b', 'Al Ain', 'al-ain', '', NULL, '2026-04-07 09:13:05.872744+00', '2026-04-07 09:13:05.872744+00');


--
-- Data for Name: areas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."areas" ("id", "city_id", "name", "slug", "description", "photos", "created_at", "updated_at") VALUES
	('944afc65-21df-409d-bed9-0251d4701271', '17014caa-48d2-4203-8e11-e8fe74db1459', 'Downtown Dubai', 'downtown-dubai', '', '{https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/area-photos/areas/b44fb387-e3d6-4206-a7a3-0541c86c8caa.jpg}', '2026-04-03 08:50:15.518803+00', '2026-04-03 10:38:08.578279+00'),
	('95e810be-41a7-4411-995c-7ca98a4c3ac8', '4c52ed42-5b8d-4e49-bf85-77ba75074210', 'Al Zafra', 'al-zafra', 'testing', '{https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/area-photos/areas/817c46e5-1778-48b3-90bd-36234ccbc411.jpg}', '2026-04-04 05:26:55.465614+00', '2026-04-08 12:05:38.363075+00'),
	('26158c6d-84e8-4b44-8f6b-7527ac2d7cef', '17014caa-48d2-4203-8e11-e8fe74db1459', 'Dubai Mall', 'dubai-mall', '', '{https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/area-photos/areas/03161e41-28c4-4c99-8b70-62fe80148527.jpg}', '2026-04-07 08:45:33.846412+00', '2026-04-08 12:20:58.840856+00'),
	('ca6851eb-bb16-44f0-8f4b-c41a495145b9', '4c52ed42-5b8d-4e49-bf85-77ba75074210', 'Yas island', 'yas-island', '', '{https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/area-photos/areas/4db7f312-e613-4a06-bd2b-3e10aea1da6b.jpg}', '2026-04-07 08:50:04.154079+00', '2026-04-07 08:50:04.154079+00'),
	('e05ee5bb-e425-4825-b76b-ff7d32d33ec7', '4c52ed42-5b8d-4e49-bf85-77ba75074210', 'test new area', 'test-new-area', '', '{}', '2026-04-07 08:57:34.729329+00', '2026-04-07 08:57:34.729329+00'),
	('6133d145-7a6d-437a-881b-7da9dde19a5f', '727d3534-ce4a-4438-8f6c-d1e042d40b91', 'Testing new area', 'testing-new-area', '', '{https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/area-photos/areas/44185e92-93ea-4377-be97-85bfa26f2293.jpg}', '2026-04-07 08:53:56.236291+00', '2026-04-07 10:00:26.059882+00');


--
-- Data for Name: areas_amenities; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."areas_amenities" ("area_id", "amenity_id", "id") VALUES
	('ca6851eb-bb16-44f0-8f4b-c41a495145b9', 'a2216897-5adf-43c5-9daf-fdaf9b147d66', '21eab817-521e-4da5-846e-3d7f403cc523'),
	('ca6851eb-bb16-44f0-8f4b-c41a495145b9', 'bacc4562-5a78-4372-a60f-91f5fcc805c0', 'ad870491-b258-461e-ad19-b70040846f8e'),
	('6133d145-7a6d-437a-881b-7da9dde19a5f', 'a2216897-5adf-43c5-9daf-fdaf9b147d66', 'd3bf7f54-80e1-4197-9b55-b51130b9b066'),
	('95e810be-41a7-4411-995c-7ca98a4c3ac8', 'bacc4562-5a78-4372-a60f-91f5fcc805c0', '19be3649-c30d-4009-bbaa-28518ac39f45'),
	('26158c6d-84e8-4b44-8f6b-7527ac2d7cef', 'a2216897-5adf-43c5-9daf-fdaf9b147d66', 'd4ac518e-d727-4463-917f-fe864dd7b303'),
	('26158c6d-84e8-4b44-8f6b-7527ac2d7cef', 'bacc4562-5a78-4372-a60f-91f5fcc805c0', '8b616716-0725-48d4-8db8-3ed8ffb06e9b');


--
-- Data for Name: areas_amenities_faqs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."areas_amenities_faqs" ("id", "area_id", "question", "answer", "created_at") VALUES
	('87f8837b-3d7b-4690-b52f-7c16e7503d18', '944afc65-21df-409d-bed9-0251d4701271', 'Testing Second Amenitites Faq', 'Testing Second amenitites faqs anser
', '2026-04-06 12:09:19.292677+00'),
	('f317310b-f2ab-4a90-97fc-cd3035ee8a33', '95e810be-41a7-4411-995c-7ca98a4c3ac8', 'Amenities in Discovery Gardens', 'Discovery Gardens is surrounded by amenities; schools, clinics, and supermarkets are all a stone’s throw away. The availability of the Discovery Gardens Pavilion and Ibn Battuta Mall ensures everything you need is within reach.', '2026-04-08 11:29:11.866269+00'),
	('d794c12e-89c5-4074-aaea-ce7d0f900b6e', '95e810be-41a7-4411-995c-7ca98a4c3ac8', 'Schools and Nurseries in Discovery Gardens', 'Chubby Cheeks Nursery (Building 59, 5 Street 5, EYFS curriculum)
Additional schools and nurseries are available in nearby communities like The Gardens', '2026-04-08 11:29:11.866269+00'),
	('c96f7795-8a63-4c59-a005-432b914d5d3e', '26158c6d-84e8-4b44-8f6b-7527ac2d7cef', 'TEsting AMenity', 'Testin Amenity Anser', '2026-04-08 12:20:47.297818+00');


--
-- Data for Name: areas_faqs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."areas_faqs" ("id", "area_id", "question", "answer", "created_at") VALUES
	('e42b450a-8549-44a7-abb1-07dedcf9a34c', '944afc65-21df-409d-bed9-0251d4701271', 'Testing New QUestion ', 'Testing NEw Asnwer', '2026-04-06 12:01:56.34541+00'),
	('8360efa6-991e-4481-9dd8-de2ba20e497e', '26158c6d-84e8-4b44-8f6b-7527ac2d7cef', 'Testing', 'Testingg n', '2026-04-08 12:20:29.393461+00'),
	('12600f25-88c2-43f4-85e1-1aa07d3117b3', '95e810be-41a7-4411-995c-7ca98a4c3ac8', 'Are pets allowed in Discovery Gardens apartments?', 'Not all apartments are pet-friendly. It is important to check with your landlord or property manager regarding pet policies before moving in.', '2026-04-08 12:45:30.290619+00'),
	('25055050-750a-4a3e-8387-5843ab4eda1e', '95e810be-41a7-4411-995c-7ca98a4c3ac8', '   What are the main clusters in Discovery Gardens and how do they differ?', 'Discovery Gardens is divided into six themed clusters: Zen, Mediterranean, Contemporary, Mesoamerican, Mogul, and Cactus. Each cluster features unique landscaping and amenities, such as gardens, pools, and play areas.', '2026-04-08 12:45:30.290619+00'),
	('0659d57d-6f5d-4329-991e-dffe8db0f129', '95e810be-41a7-4411-995c-7ca98a4c3ac8', 'Is Discovery Gardens suitable for families with children?', 'Yes, Discovery Gardens is known for its family-friendly atmosphere, with playgrounds, parks, nurseries, and schools nearby.', '2026-04-08 12:45:30.290619+00');


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."categories" ("id", "name", "slug", "description", "created_at", "updated_at", "logo_url") VALUES
	('b8cf7000-4dca-4952-9f61-f9b40999f356', 'penthouse', 'penthouse', NULL, '2026-03-26 09:29:08.383385+00', '2026-03-26 09:29:08.383385+00', NULL),
	('00000000-0000-0000-0000-000000000001', 'Uncategorized', 'uncategorized', 'Default category for properties without a specific category', '2026-03-30 11:16:27.539073+00', '2026-03-30 11:16:27.539073+00', NULL),
	('11111111-1111-1111-1111-111111111007', 'Loft', 'loft', 'Open-concept units with high ceilings and industrial design', '2026-03-31 05:51:44.9189+00', '2026-03-31 05:51:44.9189+00', NULL),
	('11111111-1111-1111-1111-111111111009', 'Off-Plan', 'off-plan', 'Under construction with flexible payment plans', '2026-03-31 05:51:44.9189+00', '2026-03-31 05:51:44.9189+00', NULL),
	('11111111-1111-1111-1111-111111111010', 'Ready', 'ready', 'Completed properties ready for immediate use', '2026-03-31 05:51:44.9189+00', '2026-03-31 05:51:44.9189+00', NULL),
	('11111111-1111-1111-1111-111111111011', 'Resale', 'resale', 'Pre-owned properties in established communities', '2026-03-31 05:51:44.9189+00', '2026-03-31 05:51:44.9189+00', NULL),
	('11111111-1111-1111-1111-111111111012', 'Office', 'office', 'Commercial units in business districts (DIFC, Business Bay, JLT)', '2026-03-31 05:51:44.9189+00', '2026-03-31 05:51:44.9189+00', NULL),
	('11111111-1111-1111-1111-111111111016', 'Labor Camp', 'labor-camp', 'Workforce accommodation in industrial areas', '2026-03-31 05:51:44.9189+00', '2026-03-31 05:51:44.9189+00', NULL),
	('11111111-1111-1111-1111-111111111017', 'Residential Plot', 'residential-plot', 'Land for residential development', '2026-03-31 05:51:44.9189+00', '2026-03-31 05:51:44.9189+00', NULL),
	('11111111-1111-1111-1111-111111111018', 'Commercial Plot', 'commercial-plot', 'Land for commercial development', '2026-03-31 05:51:44.9189+00', '2026-03-31 05:51:44.9189+00', NULL),
	('11111111-1111-1111-1111-111111111020', 'Mixed-Use Plot', 'mixed-use-plot', 'Land for combined residential and commercial use', '2026-03-31 05:51:44.9189+00', '2026-03-31 05:51:44.9189+00', NULL),
	('11111111-1111-1111-1111-111111111021', 'Hotel Apartment', 'hotel-apartment', 'Furnished units with hospitality services', '2026-03-31 05:51:44.9189+00', '2026-03-31 05:51:44.9189+00', NULL),
	('11111111-1111-1111-1111-111111111026', 'Island Property', 'island-property', 'Exclusive homes on Palm Jumeirah, Bluewaters, The World', '2026-03-31 05:51:44.9189+00', '2026-03-31 05:51:44.9189+00', NULL),
	('11111111-1111-1111-1111-111111111028', 'Plaza Unit', 'plaza-unit', 'Ground-floor retail in residential buildings', '2026-03-31 05:51:44.9189+00', '2026-03-31 05:51:44.9189+00', NULL),
	('11111111-1111-1111-1111-111111111029', 'Full Floor', 'full-floor', 'Entire floors in towers for corporate use', '2026-03-31 05:51:44.9189+00', '2026-03-31 05:51:44.9189+00', NULL),
	('0be0aa0c-8ad6-402c-8c06-8ad0b5367061', 'villa', 'villa', '', '2026-03-26 09:29:08.383385+00', '2026-03-26 09:29:08.383385+00', '{"url": "https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/category-logos/logos/387084c5-0d41-447d-accb-682678f790f8.svg", "alt_tag": "Land Plot"}'),
	('3604e841-d5cf-4d9e-ad7a-fdaa7d74dae2', 'land', 'land', '', '2026-03-26 09:29:08.383385+00', '2026-03-26 09:29:08.383385+00', '{"url": "https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/category-logos/logos/5d0b5840-467a-4aaa-941c-3485b587ce9b.svg", "alt_tag": "Land Plot"}'),
	('ea6f8d8c-d359-4ff6-b2de-ba73365a1c46', 'Branded Residence', 'branded-residence', '', '2026-04-07 09:15:16.932642+00', '2026-04-07 09:15:16.932642+00', NULL),
	('11111111-1111-1111-1111-111111111005', 'Duplex', 'duplex', 'Two-level apartments with internal staircases', '2026-03-31 05:51:44.9189+00', '2026-03-31 05:51:44.9189+00', NULL),
	('11111111-1111-1111-1111-111111111019', 'Industrial Plot', 'industrial-plot', 'Land for manufacturing and logisticsss', '2026-03-31 05:51:44.9189+00', '2026-03-31 05:51:44.9189+00', NULL),
	('11111111-1111-1111-1111-111111111001', 'Apartment', 'apartment', 'Residential units in towers and buildings, from studio to 4+ bedrooms', '2026-03-31 05:51:44.9189+00', '2026-03-31 05:51:44.9189+00', NULL);


--
-- Data for Name: developers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."developers" ("id", "name", "slug", "description", "website_url", "delivery_timeliness_score", "service_charge_score", "build_quality_score", "after_sales_score", "total_projects", "completed_projects", "ongoing_projects", "years_active", "created_at", "updated_at", "logo_url") VALUES
	('2c97e359-0f8c-4abc-b8e0-26b07fd36a35', 'Aldaar Properties', 'aldaar-properties', 'Aldar Properties PJSC main Image
Aldar Properties is Abu Dhabi''s premier developer founded in 2004, shaping world-class communities with a wide range of properties to choose from. Famous for creating luxurious living experiencesasdfsadf.', 'https://aldaar.com', 4, 1, 5, 5, 4, 2, 2, 5, '2026-04-01 05:43:39.539769+00', '2026-04-07 05:55:45.560346+00', '{"url": "https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/developer-logos/logos/ab4c0c95-8c33-4870-ace7-0a672a87565b.png", "alt_tag": "ab4c0c95-8c33-4870-ace7-0a672a87565b"}'),
	('c4d8d706-3458-43d4-b775-a74c09a11cb5', 'Emmar Properties', 'emmar-properties', 'Testing Descriptoin', 'https://emaar-properties.com', 4, 3, 3, 4, 3, 2, 3, 2, '2026-03-31 12:13:00.139608+00', '2026-04-07 05:56:42.73765+00', '{"url": "https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/developer-logos/logos/28155e69-81d8-401f-9ba2-cce78ca556f8.png", "alt_tag": "Emmar"}'),
	('12256bed-4397-4708-906a-7bf2633dbbcb', 'Azizi Developers', 'azizi-developers', 'Testing Aziz Descriptions', 'https://azizi.com', 4, 4, 4, 4, 10, 5, 2, 10, '2026-04-01 07:03:08.615372+00', '2026-04-01 10:32:36.324422+00', '{"url": "https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/developer-logos/logos/0edcacea-da90-499c-ace2-e7c0ca2fbf21.png", "alt_tag": "0edcacea-da90-499c-ace2-e7c0ca2fbf21"}');


--
-- Data for Name: properties; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."properties" ("id", "title", "description", "bedrooms", "bathrooms", "size_sqft", "price_aed", "status", "golden_visa_eligible", "features", "floor_plan", "created_at", "updated_at", "category_id", "developer_id", "photos", "slug") VALUES
	('1607c0e3-d945-47e6-9f13-ef1c60da915c', 'vshal properties', 'testing descriptno of vishal', 4, 1, 20000, 20000.00, 'available', true, '{}', NULL, '2026-04-07 11:05:01.478584+00', '2026-04-07 11:05:25.136397+00', '00000000-0000-0000-0000-000000000001', '2c97e359-0f8c-4abc-b8e0-26b07fd36a35', '[{"url": "https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/property-photos/temp/73f97e00-3a5c-4471-a333-dc4d6b179981.jpg", "alt_tag": "Yas Island"}]', 'vshal-properties'),
	('90f4cf11-9f4c-4d04-a0c7-9f7e5767e113', '4-BR Studio in Bluewaters Island', 'Luxurious apartment with stunning views and premium finishes throughout.', 3, 4, 2500, 1700000.00, 'available', false, '{Concierge,Balcony,Security,"Central A/C",Jacuzzi,"Smart Home","Fully Fitted Kitchen","Private Beach Access"}', 'https://example.com/floorplans/1774344992872.pdf', '2026-03-24 09:36:34.481789+00', '2026-04-07 06:41:52.188795+00', '0be0aa0c-8ad6-402c-8c06-8ad0b5367061', '12256bed-4397-4708-906a-7bf2633dbbcb', '[{"url": "https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/property-photos/90f4cf11-9f4c-4d04-a0c7-9f7e5767e113/763484e5-7a85-44e0-8760-9146bfeabc16.jpg", "alt_tag": "763484e5-7a85-44e0-8760-9146bfeabc16"}]', '4-br-studio-in-bluewaters-island'),
	('6e377748-4522-4287-b942-224f27fee86e', 'testing new property', 'Testing Property description', 5, 1, 2000, 19999.00, 'available', true, '{}', NULL, '2026-04-08 08:14:57.318501+00', '2026-04-08 08:14:57.318501+00', '00000000-0000-0000-0000-000000000001', '12256bed-4397-4708-906a-7bf2633dbbcb', '[{"url": "https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/property-photos/temp/11f5895a-d3e2-467f-861a-6589657705de.jpg", "alt_tag": "Yas Island"}]', 'testing-new-property'),
	('259dcdd1-1595-4022-adfe-d62b803b06e9', '4-BR Flat in Palm Jumeirah', 'Contemporary living space in a prime location with world-class facilities.', 3, 4, 1200, 1100000.00, 'reserved', true, '{Security,"Swimming Pool",Jacuzzi,"Children''s Play Area"}', 'https://example.com/floorplans/1774344992872.pdf', '2026-03-24 09:36:34.197799+00', '2026-04-07 11:38:14.151776+00', '0be0aa0c-8ad6-402c-8c06-8ad0b5367061', '2c97e359-0f8c-4abc-b8e0-26b07fd36a35', '[{"url": "https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/property-photos/259dcdd1-1595-4022-adfe-d62b803b06e9/1979e2d0-9aaf-46ee-854e-10bb326b2b70.jpg", "alt_tag": "1979e2d0-9aaf-46ee-854e-10bb326b2b70"}]', '4-br-flat-in-palm-jumeirah'),
	('14b62f5a-28b4-4776-8c4c-006ce6300ded', 'Land in Meydan', 'Land parcel with approved plans for luxury residential development.', 0, 1, 7500, 16000000.00, 'reserved', true, '{}', NULL, '2026-03-24 09:36:33.999943+00', '2026-04-07 11:54:57.547143+00', '3604e841-d5cf-4d9e-ad7a-fdaa7d74dae2', 'c4d8d706-3458-43d4-b775-a74c09a11cb5', '[{"url": "https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/property-photos/14b62f5a-28b4-4776-8c4c-006ce6300ded/c0a09d6c-79eb-4535-863d-12bc162deaf5.jpg", "alt_tag": "c0a09d6c-79eb-4535-863d-12bc162deaf5"}, {"url": "https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/property-photos/14b62f5a-28b4-4776-8c4c-006ce6300ded/75f3027a-9fbd-4431-89a2-892004f924e7.jpg", "alt_tag": "75f3027a-9fbd-4431-89a2-892004f924e7"}]', 'land-in-meydan'),
	('5d241ef3-c25d-4ae1-9f15-63a076ad3dc0', 'Luxury 2br apartment downtown dubai', 'Testing descripton ', 5, 2, 15, 20000.00, 'available', true, '{}', NULL, '2026-04-07 09:09:04.422983+00', '2026-04-08 07:03:55.614563+00', '11111111-1111-1111-1111-111111111001', 'c4d8d706-3458-43d4-b775-a74c09a11cb5', '[{"url": "https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/property-photos/temp/10254e52-5302-40c1-bf1c-9162a05d155b.jpg", "alt_tag": "Pexels Belle Co 99483 402028"}]', 'luxury-2br-apartment-downtown-dubai'),
	('5155d5f2-9fe4-4591-9b30-7929babc1029', 'Land in JBR', 'Prime plot of land in a sought-after location with development potentials.', 3, 1, 15100, 28200000.00, 'available', true, '{}', NULL, '2026-03-24 09:36:33.999943+00', '2026-04-08 08:30:56.390091+00', '3604e841-d5cf-4d9e-ad7a-fdaa7d74dae2', 'c4d8d706-3458-43d4-b775-a74c09a11cb5', '[{"url": "https://uctnywzaamlemmxtcghn.supabase.co/storage/v1/object/public/property-photos/5155d5f2-9fe4-4591-9b30-7929babc1029/0722dc17-7577-49cd-99f5-5688061c368d.jpg", "alt_tag": "Pexels Curtis Adams 1694007 4469136"}]', 'land-in-jbr');


--
-- Data for Name: areas_properties; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."areas_properties" ("area_id", "property_id", "id") VALUES
	('6133d145-7a6d-437a-881b-7da9dde19a5f', '5155d5f2-9fe4-4591-9b30-7929babc1029', '2715517f-6af4-464e-9c7b-cc2eea796017'),
	('95e810be-41a7-4411-995c-7ca98a4c3ac8', '5155d5f2-9fe4-4591-9b30-7929babc1029', 'ec748570-3a14-405c-887f-d0d34ee9489d'),
	('26158c6d-84e8-4b44-8f6b-7527ac2d7cef', '5155d5f2-9fe4-4591-9b30-7929babc1029', 'f4494936-ec6f-4f78-9b90-f5be3b8037b3'),
	('26158c6d-84e8-4b44-8f6b-7527ac2d7cef', '14b62f5a-28b4-4776-8c4c-006ce6300ded', 'd18a5e36-b63d-46d8-aa59-a24aa42011e7');


--
-- Data for Name: properties_amenities; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."properties_amenities" ("id", "property_id", "amenity_id", "created_at") VALUES
	('5eea34a3-487b-4810-a88c-fae9a43ca776', '5d241ef3-c25d-4ae1-9f15-63a076ad3dc0', 'a2216897-5adf-43c5-9daf-fdaf9b147d66', '2026-04-08 07:03:56.636075+00'),
	('fed63938-3236-4439-9012-dd9c68282b44', '6e377748-4522-4287-b942-224f27fee86e', 'c1c9246f-b3cb-451a-891c-465c4ca4c0af', '2026-04-08 08:14:57.6979+00'),
	('bc6f111c-1b43-4b7f-9642-65270a8f1d8b', '6e377748-4522-4287-b942-224f27fee86e', 'bacc4562-5a78-4372-a60f-91f5fcc805c0', '2026-04-08 08:14:57.6979+00'),
	('5b753110-88e3-4a13-8177-46abe6519490', '6e377748-4522-4287-b942-224f27fee86e', 'a2216897-5adf-43c5-9daf-fdaf9b147d66', '2026-04-08 08:14:57.6979+00'),
	('a246cbcc-4615-45c1-b025-a2145393983c', '5155d5f2-9fe4-4591-9b30-7929babc1029', 'c1c9246f-b3cb-451a-891c-465c4ca4c0af', '2026-04-08 08:30:57.461171+00'),
	('0592355a-7e93-4d18-bff2-6f699c525f08', '5155d5f2-9fe4-4591-9b30-7929babc1029', 'a2216897-5adf-43c5-9daf-fdaf9b147d66', '2026-04-08 08:30:57.461171+00'),
	('78da6c1a-2f58-4cd0-82ca-6a245c1a5ddb', '5155d5f2-9fe4-4591-9b30-7929babc1029', 'bacc4562-5a78-4372-a60f-91f5fcc805c0', '2026-04-08 08:30:57.461171+00');


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_roles" ("id", "user_id", "role", "created_at") VALUES
	(1, '94baa452-4aa5-4d35-9576-7d736b34b946', 'admin', '2026-03-17 09:56:49.237655+00'),
	(9, '5043fe13-aaf7-4efb-b3a4-46ddb14cc421', 'customer', '2026-03-20 06:08:43.744064+00'),
	(10, '3d686792-6313-49ea-b6df-ab8fc66bea23', 'customer', '2026-03-21 04:25:00.64251+00');


--
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."user_roles_id_seq"', 11, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict eYztJSSxid6sJvfZrColPEsepsblosIHgeOjiwOotvNJshwHbGbO6RFT8TYKXAJ

RESET ALL;
