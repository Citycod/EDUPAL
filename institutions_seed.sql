BEGIN;

INSERT INTO academic.institutions (name) VALUES
-- Federal Universities (Missing from current list)
('Federal University of Technology, Yola'),
('Modibbo Adama University of Technology, Yola'),
('University of Agriculture, Makurdi'),
('Federal University, Gashua'),
('Federal University, Gusau'),
('Federal University, Birnin Kebbi'),
('Federal University, Ndifu-Alike'),

-- State Universities (Missing from current list)
('Kano University of Science and Technology'),
('Enugu State University of Science and Technology'),
('Imo State University'),
('Nasarawa State University'),
('Benue State University'),
('Kogi State University'),
('Niger Delta University'),
('Akwa Ibom State University'),
('Taraba State University'),
('Cross River University of Technology'),
('Ebonyi State University'),

-- Private Universities (Missing from current list)
('Landmark University'),
('Caleb University'),
('Al-Hikmah University'),
('Caritas University'),
('Novena University'),
('Veritas University'),

-- Federal Colleges of Education (NCE)
('Adeyemi College of Education, Ondo'),
('Federal College of Education, Kano'),
('Federal College of Education, Zaria'),
('Federal College of Education (Technical), Akoka'),
('Federal College of Education (Special), Oyo'),
('Alvan Ikoku Federal College of Education, Owerri'),
('Federal College of Education, Pankshin'),
('Federal College of Education, Okene'),
('Federal College of Education, Abeokuta'),
('Federal College of Education, Obudu'),
('Federal College of Education (Technical), Asaba'),
('Federal College of Education, Eha-Amufu'),
('Federal College of Education, Kontagora'),
('Federal College of Education, Katsina'),
('Federal College of Education (Technical), Omoku'),
('Federal College of Education (Technical), Bichi'),
('Federal College of Education (Technical), Umunze'),
('Federal College of Education (Technical), Gombe'),
('Federal College of Education (Technical), Potiskum'),
('Federal College of Education, Yola'),

-- State Colleges of Education (NCE)
('College of Education, Akwanga'),
('College of Education, Warri'),
('College of Education, Agbor'),
('Kwara State College of Education, Ilorin'),
('Kwara State College of Education, Oro'),
('Kaduna State College of Education, Gidan Waya'),
('Emmanuel Alayande College of Education, Oyo'),
('Tai Solarin College of Education, Omu-Ijebu'),
('Osun State College of Education, Ilesa'),
('Osun State College of Education, Ila-Orangun'),
('Kano State College of Education, Kano'),
('Niger State College of Education, Minna'),
('Edo State College of Education, Igueben'),
('Delta State College of Physical Education, Mosogar'),
('Isa Kaita College of Education, Dutsin-Ma'),
('Nwafor Orizu College of Education, Nsugbe'),
('Enugu State College of Education (Technical), Enugu'),
('Rivers State College of Education, Port Harcourt'),
('Cross River State College of Education, Akamkpa')

ON CONFLICT (name) DO NOTHING;

COMMIT;
