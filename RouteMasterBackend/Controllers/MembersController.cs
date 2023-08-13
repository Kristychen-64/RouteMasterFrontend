﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RouteMasterBackend.DTOs;
using RouteMasterBackend.Models;

namespace RouteMasterBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembersController : ControllerBase
    {
        private readonly RouteMasterContext _context;

        public MembersController(RouteMasterContext context)
        {
            _context = context;
        }

        // GET: api/Members
        [HttpGet]
        public async Task<IEnumerable<OrderDTO>> GetOrders()
        {
          if (_context.Orders == null)
          {
              return null;
          }
            return  _context.Orders.Select(historyOrder => new OrderDTO
            {
                Id = historyOrder.MemberId,
                PaymentStatusId = historyOrder.PaymentStatusId,
            });
            
        }

        // GET: api/Members/5
        [HttpGet("{id}")]
        public async Task<OrderDTO> GetOrders(int id)
        {
          if (_context.Orders == null)
          {
                return null;
          }
            OrderDTO historyorderDTO = _context.Orders.Where(h => h.Id == id).Select(h => new OrderDTO
            {
                Id = h.Id,
                PaymentStatusId = h.PaymentStatusId,
            }).Single();

            return historyorderDTO;
        }

        // PUT: api/Members/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMember(int id, Member member)
        {
            if (id != member.Id)
            {
                return BadRequest();
            }

            _context.Entry(member).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MemberExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Members
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Member>> PostMember(Member member)
        {
          if (_context.Members == null)
          {
              return Problem("Entity set 'RouteMasterContext.Members'  is null.");
          }
            _context.Members.Add(member);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMember", new { id = member.Id }, member);
        }

        // DELETE: api/Members/5
        [HttpDelete("{id}")]
        public async Task<Member> DeleteMember(int id)
        {
            if (_context.Members == null)
            {
                return null;
            }
            var member = await _context.Members.FindAsync(id);
            if (member == null)
            {
                return null;
            }

            _context.Members.Remove(member);
            await _context.SaveChangesAsync();

            return null;
        }

        

        private bool MemberExists(int id)
        {
            return (_context.Members?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}