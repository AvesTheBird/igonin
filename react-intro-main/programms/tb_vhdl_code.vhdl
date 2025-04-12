library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity tb_adder is
end tb_adder;

architecture testbench of tb_adder is

  signal X1 : std_logic := '0';
  signal X2 : std_logic := '0';
  signal X3 : std_logic := '0';
  signal F1 : std_logic;

  component circuit
    port (
      X1 : in std_logic;
      X2 : in std_logic;
      X3 : in std_logic;
      F1 : out std_logic
    );
  end component;

begin

  uut: circuit
    port map (
      X1 => X1,
      X2 => X2,
      X3 => X3,
      F1 => F1
    );

  process
  begin
    -- Test 1
    X1 <= '0'; X2 <= '0'; X3 <= '0';
    wait for 10 ns;
    assert (F1 = '0') report "Test 1 failed: expected F1 = 0" severity error;

    -- Test 2
    X1 <= '1'; X2 <= '0'; X3 <= '0';
    wait for 10 ns;
    assert (F1 = '1') report "Test 2 failed: expected F1 = 1" severity error;

    -- Test 3
    X1 <= '0'; X2 <= '1'; X3 <= '0';
    wait for 10 ns;
    assert (F1 = '1') report "Test 3 failed: expected F1 = 1" severity error;

    -- Test 4
    X1 <= '0'; X2 <= '0'; X3 <= '1';
    wait for 10 ns;
    assert (F1 = '1') report "Test 4 failed: expected F1 = 1" severity error;

    -- Test 5
    X1 <= '1'; X2 <= '0'; X3 <= '1';
    wait for 10 ns;
    assert (F1 = '1') report "Test 5 failed: expected F1 = 1" severity error;

    -- Test 6
    X1 <= '1'; X2 <= '1'; X3 <= '1';
    wait for 10 ns;
    assert (F1 = '1') report "Test 6 failed: expected F1 = 1" severity error;

    report "All tests passed successfully." severity note;
    wait;
  end process;

end testbench;
