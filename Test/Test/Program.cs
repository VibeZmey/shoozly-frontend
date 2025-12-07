using System;

namespace Test
{
	public class Program
	{
		public static void Main(string[] args)
		{
			int[] nums = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0];
			int k = 2;

			int res = 0;
			int buf = 0;
			bool f = false;
			var a = new List<string>();
			for (int i = 0; i < nums.Length-1; i++)
			{
				string str = nums[i].ToString();
				for (int j = i + 1; j < nums.Length; j++)
				{
					str+=nums[j].ToString();
				}
				a.Add(str);
			}
			var res = a.Where(s => s.Count(c => c == '0'))
			Console.WriteLine(String.Join(", ", a));

		}
	}
};

