-- Seed content (idempotent at migration level — runs once).
insert into public.services (key, emoji, title, description, is_new, enabled, sort_order) values
  ('ac','❄','AC Installation & Repair','All brands · gas · servicing',false,true,0),
  ('solar','☀','Solar Systems','On/off-grid · hybrid · net metering',false,true,1),
  ('ups','⚡','Inverter & UPS','Install · repair · maintenance',false,true,2),
  ('elec','🔌','Electrical Work','Wiring · DB · fault finding',false,true,3),
  ('cctv','📹','CCTV & Surveillance','Cameras · NVR · app setup',false,true,4),
  ('plumb','🔧','Plumbing','Pipes · fixtures · leaks',true,true,5),
  ('weld','🔥','Welding','Grills · gates · fabrication',true,true,6),
  ('civil','🏗','Civil Work','Small builds · repairs · finishes',true,false,7)
on conflict (key) do nothing;

insert into public.settings (id, business_name, primary_phone, whatsapp_number, email, service_areas, coming_soon_areas, emergency_24_7)
values ('singleton','Farhan Business Solution Enterprise','0311-3183186','0311-3183186','owner@fbsenterprise.com',
  array['Hayatabad','University Town','Warsak Road','Saddar','Tehkal','Gulberg'],
  array['Charsadda','Mardan'], true)
on conflict (id) do nothing;

insert into public.projects (title, service, area, done_on, image_url, published) values
  ('5kW On-grid Solar','Solar','Hayatabad','May 2026','https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=900&q=80&auto=format&fit=crop',true),
  ('8-Camera CCTV Setup','CCTV','Warsak Rd','Apr 2026','https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=900&q=80&auto=format&fit=crop',true),
  ('Full House Rewiring','Electrical','Saddar','Apr 2026','https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=80&auto=format&fit=crop',true),
  ('Inverter AC Install x3','AC','University Town','Mar 2026','https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=900&q=80&auto=format&fit=crop',false),
  ('Custom Steel Gate','Welding','Tehkal','Mar 2026','https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900&q=80&auto=format&fit=crop',true);

insert into public.testimonials (name, meta, stars, quote, published) values
  ('Ahmed K.','Hayatabad · AC repair',5,'AC fixed within 3 hours of my call. Professional and fair price.',true),
  ('Sana M.','University Town · Solar',5,'Got a 5kW system installed. Power bill dropped 80%. Handled net metering too.',true),
  ('Bilal R.','Saddar · CCTV',5,'Installed 6 cameras around our shop. Mobile app works great. Recommended.',true),
  ('Nida F.','Warsak Road · Electrical',4,'Whole-house rewiring, on time and on budget. Felt like craftsmanship.',false);

insert into public.leads (name, phone, service, area, urgency, status, note) values
  ('Ahmed Khan','0312-1145566','ac','Hayatabad','Urgent','new','AC not cooling since yesterday, makes a clicking sound.'),
  ('Sana Malik','0301-7788991','solar','University Town','Normal','new','Want a quote for ~5kW on-grid system. 2-storey house.'),
  ('Bilal Raza','0345-2010102','cctv','Saddar','Normal','contacted','6 cameras for a shop, need mobile viewing.'),
  ('Nida Farooq','0333-9087612','elec','Warsak Road','Urgent','scheduled','DB tripping repeatedly after rain.'),
  ('Imran S.','0307-4451200','plumb','Tehkal','Emergency','new','Major leak under kitchen sink, water everywhere.'),
  ('Rabia A.','0321-6677001','weld','Gulberg','Normal','done','Custom gate fabrication, ~8ft.');
