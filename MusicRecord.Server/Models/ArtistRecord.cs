using System;

namespace MusicRecord.Server.Models
{
    public class Artists
    {
        public required ArtistRecord[] data { get; set; }
    }
    public class ArtistRecord
    {
        public int Id { get; set; }
        public required string Artist { get; set; }
        public required decimal Rate { get; set; }
        public required int Streams { get; set; }
        public bool PayoutComplete { get; set; }
        public decimal Payout { get; set; }
      
        public decimal AverageMonthlyPayout
        {
            get
            {
                var monthsSince2006 = (DateTime.Now.Year - 2006) * 12 + DateTime.Now.Month - 4;
                return Payout / monthsSince2006;
            }
        }
    }
}
