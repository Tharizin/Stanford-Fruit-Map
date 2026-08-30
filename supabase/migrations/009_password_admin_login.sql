-- Switched admin login from email-based (magic link / OTP, both of which
-- ran into email deliverability problems) to a single shared password
-- account. Add the fixed placeholder email used by that account, and
-- remove the old email-based admin rows.
insert into admins (email) values ('admin@stanfordfruitmap.local')
on conflict (email) do nothing;

delete from admins where email in ('echamb@stanford.edu', 'edith.chamberlain50@gmail.com');
