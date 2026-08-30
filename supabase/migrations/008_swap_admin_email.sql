-- Swap the admin account from the Stanford email (login codes were being
-- silently consumed by Stanford's email link-scanning before they could be
-- used) to a personal Gmail address. Insert the new admin before deleting
-- the old one, since admins_prevent_last_delete blocks removing the only
-- remaining admin.
insert into admins (email) values ('edith.chamberlain50@gmail.com')
on conflict (email) do nothing;

delete from admins where email = 'echamb@stanford.edu';
